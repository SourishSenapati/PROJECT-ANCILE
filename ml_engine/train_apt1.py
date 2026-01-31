"""
APT-1 Model Trainer
-------------------
Trains an XGBoost Binary Classifier to predict cancellation risk.
Exports the trained model to ONNX format for efficient inference.
"""

import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from xgboost import XGBClassifier
from skl2onnx import convert_sklearn, update_registered_converter
from skl2onnx.common.data_types import FloatTensorType, StringTensorType
from skl2onnx.common.shape_calculator import calculate_linear_classifier_output_shapes
try:
    from onnxmltools.convert.xgboost.operator_converters.xgboost import convert_xgboost
except ImportError:
    # Fallback or maybe it's under a different path in newer versions
    # For now, let's try to proceed without explicit import if possible,
    # or use a broader try-except block in the main code.
    print("Warning: Could not import convert_xgboost. ONNX export might fail.")
    convert_xgboost = None


def train_and_export():
    """
    Trains the XGBoost model on synthetic data and exports it to ONNX.
    """
    # 1. Load Data
    data_path = os.path.join(os.path.dirname(
        __file__), "fake_wedding_data.csv")
    if not os.path.exists(data_path):
        raise FileNotFoundError("Please run generate_data.py first.")

    df = pd.read_csv(data_path)

    features = df.drop('cancellation_flag', axis=1)
    target = df['cancellation_flag']

    # 2. Preprocessing
    categorical_features = ['relation_to_host']
    numeric_features = [
        'guest_distance_km',
        'booking_lead_time',
        'room_price_vs_avg_income'
    ]

    # We use a scikit-learn Pipeline for easy ONNX conversion later
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(sparse_output=False,
                                  handle_unknown='ignore'), categorical_features)
        ]
    )

    # 3. Define Model
    # Using XGBoost within a sklearn pipeline
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', XGBClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42,
            eval_metric='logloss'
        ))
    ])

    # 4. Train
    print("Training XGBoost Model...")
    features_train, features_test, target_train, target_test = train_test_split(
        features, target, test_size=0.2, random_state=42
    )
    pipeline.fit(features_train, target_train)

    # Evaluate
    score = pipeline.score(features_test, target_test)
    print(f"Model Accuracy: {score:.4f}")

    # 5. Export
    print("Exporting Model...")

    # Always save pickle as primary fallback
    pickle_filename = "apt1_v1.pkl"
    # Save locally in ml_engine
    joblib.dump(pipeline, pickle_filename)
    print(f"Pickle Model saved locally to {pickle_filename}")

    # Copy pickle to backend so main.py can find it if ONNX is missing
    backend_pickle_path = os.path.join(
        os.path.dirname(__file__), "../backend", pickle_filename)
    joblib.dump(pipeline, backend_pickle_path)
    print(f"Pickle Model copied to {backend_pickle_path}")

    # Try ONNX
    try:
        print("Attempting ONNX conversion...")

        # Define input types for ONNX
        initial_types = [
            ('guest_distance_km', FloatTensorType([None, 1])),
            ('booking_lead_time', FloatTensorType([None, 1])),
            ('room_price_vs_avg_income', FloatTensorType([None, 1])),
            ('relation_to_host', StringTensorType([None, 1]))
        ]

        # Register converter if available
        if convert_xgboost:
            try:
                update_registered_converter(
                    XGBClassifier,
                    'XGBoostXGBClassifier',
                    calculate_linear_classifier_output_shapes,
                    convert_xgboost,
                    options={'nocl': [True, False],
                             'zipmap': [True, False, 'columns']}
                )
            except Exception as e:
                print(f"Converter registration warning: {e}")

        # Attempt conversion
        # allow_interiops=True helps with some version mismatches
        onx = convert_sklearn(
            pipeline,
            initial_types=initial_types,
            target_opset=12
        )

        output_path = os.path.join(
            os.path.dirname(__file__), "../backend/apt1_v1.onnx"
        )
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        with open(output_path, "wb") as f:
            f.write(onx.SerializeToString())

        print(f"ONNX Model saved to {output_path}")

    except Exception as e:
        print(f"ONNX Export execution skipped/failed: {e}")
        print("Using .pkl model in backend instead.")


if __name__ == "__main__":
    train_and_export()
