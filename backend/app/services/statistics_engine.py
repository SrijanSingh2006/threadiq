import math
import hashlib
from typing import Dict, Any, Tuple
from scipy import stats

def compute_user_variant(user_id: str, experiment_code: str, variants: list) -> str:
    """
    Deterministic, stable user assignment using MD5 hashing.
    Ensures that a user is consistently assigned to the exact same variant across sessions.
    """
    if not variants:
        return "control"
    
    hash_str = f"{user_id}:{experiment_code}"
    hash_val = int(hashlib.md5(hash_str.encode('utf-8')).hexdigest()[:8], 16)
    bucket = hash_val % 100 # 0 to 99
    
    cumulative = 0
    for v in variants:
        cumulative += getattr(v, 'traffic_allocation_percent', 50)
        if bucket < cumulative:
            return getattr(v, 'variant_key', 'control')
    
    return variants[0].variant_key

def calculate_two_proportion_stats(
    n_control: int,
    conversions_control: int,
    n_variant: int,
    conversions_variant: int,
    alpha: float = 0.05
) -> Dict[str, Any]:
    """
    Computes rigorous two-proportion z-test, p-value, 95% confidence intervals,
    standard errors, and sample size adequacy.
    """
    # Guard against zero divisions or edge cases
    if n_control <= 0 or n_variant <= 0:
        return {
            "error": "Sample size must be greater than 0 for both variants."
        }
    
    p1 = conversions_control / n_control
    p2 = conversions_variant / n_variant
    
    # Standard errors for individual proportions
    se1 = math.sqrt((p1 * (1 - p1)) / n_control) if n_control > 0 else 0.0
    se2 = math.sqrt((p2 * (1 - p2)) / n_variant) if n_variant > 0 else 0.0
    
    z_critical = stats.norm.ppf(1 - alpha / 2) # approx 1.96 for alpha=0.05
    
    ci1_lower = max(0.0, p1 - z_critical * se1)
    ci1_upper = min(1.0, p1 + z_critical * se1)
    
    ci2_lower = max(0.0, p2 - z_critical * se2)
    ci2_upper = min(1.0, p2 + z_critical * se2)
    
    # Lift calculations
    absolute_lift = p2 - p1
    relative_lift = ((p2 - p1) / p1 * 100.0) if p1 > 0 else 0.0
    
    # Pooled standard error for two-proportion hypothesis testing (H0: p1 = p2)
    p_pool = (conversions_control + conversions_variant) / (n_control + n_variant)
    se_pool = math.sqrt(p_pool * (1 - p_pool) * (1 / n_control + 1 / n_variant)) if p_pool > 0 and p_pool < 1 else 0.0001
    
    z_score = (p2 - p1) / se_pool if se_pool > 0 else 0.0
    # Two-tailed p-value
    p_value = 2 * (1 - stats.norm.cdf(abs(z_score)))
    
    is_significant = p_value < alpha
    confidence_level = (1 - p_value) * 100.0 if p_value < 1.0 else 0.0
    
    # Power & Recommended sample size for MDE of 5% relative lift with 80% power (beta=0.2)
    # n = 2 * ((z_alpha/2 + z_beta)^2 * p * (1-p)) / (MDE * p)^2
    z_beta = 0.84 # 80% power
    mde_relative = 0.05
    p_baseline = max(p1, 0.01)
    numerator = 2 * ((z_critical + z_beta) ** 2) * p_baseline * (1 - p_baseline)
    denominator = (mde_relative * p_baseline) ** 2
    recommended_sample_size_per_variant = int(math.ceil(numerator / denominator)) if denominator > 0 else 2500
    
    sample_size_adequate = (n_control >= recommended_sample_size_per_variant * 0.7) and (n_variant >= recommended_sample_size_per_variant * 0.7)
    
    # Decision determination
    if not sample_size_adequate:
        decision = "Inconclusive - Sample size underpowered; continue running experiment"
        conclusion = f"The test has not yet accumulated sufficient statistical power. Recommend at least {recommended_sample_size_per_variant:,} observations per variant."
    elif is_significant and absolute_lift > 0:
        decision = "Ship Variant - Statistically significant positive lift observed"
        conclusion = f"Variant demonstrated a statistically significant lift of {relative_lift:+.2f}% (p={p_value:.4f} < {alpha}). Safe to roll out to 100% of users."
    elif is_significant and absolute_lift < 0:
        decision = "Keep Control - Statistically significant negative impact detected"
        conclusion = f"Variant caused a statistically significant drop of {relative_lift:.2f}% (p={p_value:.4f} < {alpha}). Recommend abandoning or redesigning feature."
    else:
        decision = "Inconclusive - No statistically significant difference between variants"
        conclusion = f"Observed lift of {relative_lift:+.2f}% is within expected random variation (p={p_value:.4f} >= {alpha}). Hypothesis is not validated."
        
    return {
        "p1": round(p1, 4),
        "p2": round(p2, 4),
        "se1": round(se1, 4),
        "se2": round(se2, 4),
        "ci_control": (round(ci1_lower, 4), round(ci1_upper, 4)),
        "ci_variant": (round(ci2_lower, 4), round(ci2_upper, 4)),
        "absolute_lift": round(absolute_lift, 4),
        "relative_lift_percent": round(relative_lift, 2),
        "z_score": round(z_score, 3),
        "p_value": round(p_value, 5),
        "is_statistically_significant": is_significant,
        "confidence_level_percent": round(confidence_level, 1),
        "sample_size_adequate": sample_size_adequate,
        "recommended_sample_size": recommended_sample_size_per_variant,
        "decision": decision,
        "conclusion": conclusion,
    }
