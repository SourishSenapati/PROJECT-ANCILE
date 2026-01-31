"""
APT-1 Synthetic Data Generator
------------------------------
Generates 50,000 rows of 'Fake Wedding Data' to train the MVP cancellation prediction model.
Features:
- guest_distance_km
- booking_lead_time
- room_price_vs_avg_income
- relation_to_host
- outcome (0=Booked, 1=Cancelled)
"""

import pandas as pd
import numpy as np
import os


def generate_synthetic_data(num_samples=50000, seed=42):
    np.random.seed(seed)

    # 1. Generate Features

    # Distance: Heavy tail (Gamma distribution), most guests are local/regional
    guest_distance_km = np.random.gamma(shape=2, scale=200, size=num_samples)

    # Lead Time: Normal-ish but positive, usually 1-12 months out
    booking_lead_time = np.random.normal(loc=90, scale=30, size=num_samples)
    booking_lead_time = np.maximum(booking_lead_time, 1)  # Minimum 1 day

    # Affordability Index: 0.01 (cheap) to 0.5 (expensive relative to income)
    room_price_vs_avg_income = np.random.beta(a=2, b=5, size=num_samples)

    # Relation: 40% Family, 60% Friend
    relations = np.random.choice(
        ['Family', 'Friend'], size=num_samples, p=[0.4, 0.6])

    # 2. Logic for Outcome (Cancellation Risk)
    # Base Probability
    prob_cancel = 0.15 * np.ones(num_samples)

    # Adjust probability based on features (The "Signal")

    # Higher distance = slightly higher cancel risk (travel friction),
    # but very high distance might mean committed flight... let's say higher distance -> higher risk linearly for simplicity
    prob_cancel += (guest_distance_km / 1000) * 0.1

    # Longer lead time = higher chance of plans changing
    prob_cancel += (booking_lead_time / 365) * 0.2

    # Higher cost ratio = higher risk
    prob_cancel += room_price_vs_avg_income * 0.5

    # Relation: Friends are flakier than Family
    # Add risk for Friends
    prob_cancel += np.where(relations == 'Friend', 0.2, 0.0)

    # Add random noise
    prob_cancel += np.random.normal(0, 0.05, num_samples)

    # Clip probabilities
    prob_cancel = np.clip(prob_cancel, 0.01, 0.99)

    # Generate binary outcome (Bernoulli trial)
    # 1 = Cancelled, 0 = Booked
    outcome = np.random.binomial(1, prob_cancel)

    # Create DataFrame
    df = pd.DataFrame({
        'guest_distance_km': guest_distance_km,
        'booking_lead_time': booking_lead_time,
        'room_price_vs_avg_income': room_price_vs_avg_income,
        'relation_to_host': relations,
        'cancellation_flag': outcome
    })

    return df


if __name__ == "__main__":
    print("Generating synthetic data...")
    synthetic_df = generate_synthetic_data()

    # Save to CSV
    output_path = os.path.join(os.path.dirname(
        __file__), "fake_wedding_data.csv")
    synthetic_df.to_csv(output_path, index=False)
    print(f"Data saved to {output_path}")
    print(synthetic_df.head())
    print("\nClass Balance:")
    print(synthetic_df['cancellation_flag'].value_counts(normalize=True))
