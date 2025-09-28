"""
Edge Device Optimization for Underwater Image Enhancement System
Optimizes AI models for deployment on AUV/ROV edge devices with limited resources
"""

import tensorflow as tf
import numpy as np
import cv2
import os
import logging
import time
from typing import Dict, Tuple, Optional
import json

# Try to import TensorRT for GPU optimization (optional)
try:
    import tensorrt as trt
    TENSORRT_AVAILABLE = True
except ImportError:
    TENSORRT_AVAILABLE = False
    logging.warning("TensorRT not available - GPU optimization disabled")

logger = logging.getLogger(__name__)

class EdgeOptimizer:
    """
    Optimizes AI models for edge device deployment
    Supports quantization, pruning, and TensorRT optimization
    """
    
    def __init__(self):
        self.optimization_methods = [
            'quantization',
            'pruning', 
            'tensorrt',
            'tflite_conversion'
        ]
    
    def quantize_model(self, model_path: str, output_path: str, 
                      quantization_type: str = 'int8') -> Dict:
        """
        Quantize model for reduced memory footprint and faster inference
        
        Args:
            model_path: Path to original model
            output_path: Path to save quantized model
            quantization_type: 'int8', 'int16', or 'float16'
            
        Returns:
            Optimization statistics
        """
        try:
            # Load original model
            model = tf.keras.models.load_model(model_path)
            original_size = self._get_model_size(model_path)
            
            # Create representative dataset for calibration
            def representative_dataset():
                for _ in range(100):
                    # Generate sample underwater images for calibration
                    sample = np.random.random((1, 256, 256, 3)).astype(np.float32)
                    sample = (sample - 0.5) * 2.0  # Normalize to [-1, 1]
                    yield [sample]
            
            # Convert to TensorFlow Lite with quantization
            converter = tf.lite.TFLiteConverter.from_keras_model(model)
            
            if quantization_type == 'int8':
                converter.optimizations = [tf.lite.Optimize.DEFAULT]
                converter.representative_dataset = representative_dataset
                converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
                converter.inference_input_type = tf.uint8
                converter.inference_output_type = tf.uint8
            elif quantization_type == 'float16':
                converter.optimizations = [tf.lite.Optimize.DEFAULT]
                converter.target_spec.supported_types = [tf.float16]
            
            # Convert model
            quantized_model = converter.convert()
            
            # Save quantized model
            with open(output_path, 'wb') as f:
                f.write(quantized_model)
            
            quantized_size = os.path.getsize(output_path)
            compression_ratio = original_size / quantized_size
            
            stats = {
                'method': 'quantization',
                'quantization_type': quantization_type,
                'original_size_mb': original_size / (1024 * 1024),
                'quantized_size_mb': quantized_size / (1024 * 1024),
                'compression_ratio': compression_ratio,
                'size_reduction_percent': (1 - 1/compression_ratio) * 100
            }
            
            logger.info(f"Model quantized: {compression_ratio:.2f}x compression")
            return stats
            
        except Exception as e:
            logger.error(f"Quantization failed: {e}")
            raise
    
    def optimize_for_tensorrt(self, model_path: str, output_path: str,
                             precision: str = 'FP16') -> Dict:
        """
        Optimize model using TensorRT for NVIDIA GPU deployment
        
        Args:
            model_path: Path to original model
            output_path: Path to save TensorRT optimized model
            precision: 'FP32', 'FP16', or 'INT8'
            
        Returns:
            Optimization statistics
        """
        if not TENSORRT_AVAILABLE:
            raise RuntimeError("TensorRT not available")
        
        try:
            # Load model
            model = tf.keras.models.load_model(model_path)
            original_size = self._get_model_size(model_path)
            
            # Convert to TensorRT
            converter = tf.experimental.tensorrt.Converter(
                input_saved_model_dir=model_path,
                precision_mode=precision
            )
            
            converter.convert()
            converter.save(output_path)
            
            optimized_size = self._get_directory_size(output_path)
            
            stats = {
                'method': 'tensorrt',
                'precision': precision,
                'original_size_mb': original_size / (1024 * 1024),
                'optimized_size_mb': optimized_size / (1024 * 1024),
                'tensorrt_available': True
            }
            
            logger.info(f"TensorRT optimization completed with {precision} precision")
            return stats
            
        except Exception as e:
            logger.error(f"TensorRT optimization failed: {e}")
            raise
    
    def prune_model(self, model_path: str, output_path: str, 
                   sparsity: float = 0.5) -> Dict:
        """
        Prune model to reduce parameters and computation
        
        Args:
            model_path: Path to original model
            output_path: Path to save pruned model
            sparsity: Fraction of weights to prune (0.0 to 1.0)
            
        Returns:
            Optimization statistics
        """
        try:
            import tensorflow_model_optimization as tfmot
            
            # Load model
            model = tf.keras.models.load_model(model_path)
            original_params = model.count_params()
            
            # Apply pruning
            pruning_params = {
                'pruning_schedule': tfmot.sparsity.keras.ConstantSparsity(
                    target_sparsity=sparsity,
                    begin_step=0
                ),
                'block_size': (1, 1),
                'block_pooling_type': 'AVG'
            }
            
            pruned_model = tfmot.sparsity.keras.prune_low_magnitude(
                model, **pruning_params
            )
            
            # Compile pruned model
            pruned_model.compile(
                optimizer='adam',
                loss='mse',
                metrics=['mae']
            )
            
            # Save pruned model
            pruned_model.save(output_path)
            
            stats = {
                'method': 'pruning',
                'sparsity': sparsity,
                'original_parameters': original_params,
                'pruned_parameters': pruned_model.count_params(),
                'parameter_reduction_percent': sparsity * 100
            }
            
            logger.info(f"Model pruned with {sparsity:.1%} sparsity")
            return stats
            
        except ImportError:
            raise RuntimeError("TensorFlow Model Optimization not available")
        except Exception as e:
            logger.error(f"Pruning failed: {e}")
            raise
    
    def _get_model_size(self, model_path: str) -> int:
        """Get size of model file in bytes"""
        if os.path.isfile(model_path):
            return os.path.getsize(model_path)
        else:
            return self._get_directory_size(model_path)
    
    def _get_directory_size(self, directory_path: str) -> int:
        """Get total size of directory in bytes"""
        total_size = 0
        for dirpath, dirnames, filenames in os.walk(directory_path):
            for filename in filenames:
                filepath = os.path.join(dirpath, filename)
                total_size += os.path.getsize(filepath)
        return total_size

class EdgeInferenceEngine:
    """
    Optimized inference engine for edge devices
    Supports multiple model formats and optimization techniques
    """
    
    def __init__(self, model_path: str, model_type: str = 'tflite'):
        """
        Initialize inference engine
        
        Args:
            model_path: Path to optimized model
            model_type: 'tflite', 'tensorrt', or 'keras'
        """
        self.model_path = model_path
        self.model_type = model_type
        self.model = None
        self.input_details = None
        self.output_details = None
        
        self.load_model()
    
    def load_model(self):
        """Load optimized model for inference"""
        try:
            if self.model_type == 'tflite':
                self.model = tf.lite.Interpreter(model_path=self.model_path)
                self.model.allocate_tensors()
                self.input_details = self.model.get_input_details()
                self.output_details = self.model.get_output_details()
                
            elif self.model_type == 'keras':
                self.model = tf.keras.models.load_model(self.model_path)
                
            elif self.model_type == 'tensorrt':
                # Load TensorRT model (would need TensorRT Python API)
                raise NotImplementedError("TensorRT loading not implemented in prototype")
            
            logger.info(f"Model loaded successfully: {self.model_type}")
            
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise
    
    def predict(self, input_image: np.ndarray) -> np.ndarray:
        """
        Run inference on input image
        
        Args:
            input_image: Preprocessed input image
            
        Returns:
            Model output
        """
        try:
            if self.model_type == 'tflite':
                return self._predict_tflite(input_image)
            elif self.model_type == 'keras':
                return self._predict_keras(input_image)
            else:
                raise ValueError(f"Unsupported model type: {self.model_type}")
                
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            raise
    
    def _predict_tflite(self, input_image: np.ndarray) -> np.ndarray:
        """Run inference using TensorFlow Lite"""
        # Set input tensor
        self.model.set_tensor(self.input_details[0]['index'], input_image)
        
        # Run inference
        self.model.invoke()
        
        # Get output
        output = self.model.get_tensor(self.output_details[0]['index'])
        return output
    
    def _predict_keras(self, input_image: np.ndarray) -> np.ndarray:
        """Run inference using Keras model"""
        return self.model.predict(input_image, verbose=0)
    
    def benchmark_inference(self, num_runs: int = 100) -> Dict:
        """
        Benchmark inference performance
        
        Args:
            num_runs: Number of inference runs for averaging
            
        Returns:
            Performance statistics
        """
        # Create sample input
        if self.model_type == 'tflite':
            input_shape = self.input_details[0]['shape']
        else:
            input_shape = (1, 256, 256, 3)  # Default shape
        
        sample_input = np.random.random(input_shape).astype(np.float32)
        
        # Warm up
        for _ in range(5):
            self.predict(sample_input)
        
        # Benchmark
        times = []
        for _ in range(num_runs):
            start_time = time.time()
            self.predict(sample_input)
            end_time = time.time()
            times.append((end_time - start_time) * 1000)  # Convert to ms
        
        stats = {
            'model_type': self.model_type,
            'num_runs': num_runs,
            'avg_inference_time_ms': np.mean(times),
            'min_inference_time_ms': np.min(times),
            'max_inference_time_ms': np.max(times),
            'std_inference_time_ms': np.std(times),
            'fps': 1000 / np.mean(times)
        }
        
        logger.info(f"Benchmark completed: {stats['avg_inference_time_ms']:.2f}ms avg, {stats['fps']:.1f} FPS")
        return stats

class EdgeDeploymentManager:
    """
    Manages deployment and monitoring of models on edge devices
    """
    
    def __init__(self, config_path: str = "edge_config.json"):
        self.config_path = config_path
        self.config = self.load_config()
        self.models = {}
    
    def load_config(self) -> Dict:
        """Load edge deployment configuration"""
        default_config = {
            "device_type": "jetson_nano",
            "max_memory_mb": 2048,
            "target_fps": 10,
            "max_power_watts": 10,
            "models": {
                "enhancement": {
                    "path": "models/edge/enhancement_quantized.tflite",
                    "type": "tflite",
                    "priority": "high"
                },
                "detection": {
                    "path": "models/edge/detection_quantized.tflite", 
                    "type": "tflite",
                    "priority": "critical"
                }
            }
        }
        
        if os.path.exists(self.config_path):
            try:
                with open(self.config_path, 'r') as f:
                    config = json.load(f)
                return {**default_config, **config}
            except Exception as e:
                logger.warning(f"Failed to load config, using defaults: {e}")
        
        return default_config
    
    def save_config(self):
        """Save current configuration"""
        with open(self.config_path, 'w') as f:
            json.dump(self.config, f, indent=2)
    
    def deploy_model(self, model_name: str) -> bool:
        """
        Deploy a model to the edge device
        
        Args:
            model_name: Name of model to deploy
            
        Returns:
            Success status
        """
        try:
            if model_name not in self.config["models"]:
                raise ValueError(f"Model {model_name} not found in config")
            
            model_config = self.config["models"][model_name]
            
            # Load model
            engine = EdgeInferenceEngine(
                model_path=model_config["path"],
                model_type=model_config["type"]
            )
            
            # Benchmark performance
            benchmark_stats = engine.benchmark_inference()
            
            # Check if performance meets requirements
            target_fps = self.config["target_fps"]
            if benchmark_stats["fps"] < target_fps:
                logger.warning(f"Model {model_name} performance below target: "
                             f"{benchmark_stats['fps']:.1f} < {target_fps} FPS")
            
            self.models[model_name] = {
                "engine": engine,
                "stats": benchmark_stats,
                "deployed_at": time.time()
            }
            
            logger.info(f"Model {model_name} deployed successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to deploy model {model_name}: {e}")
            return False
    
    def get_system_status(self) -> Dict:
        """Get current system status and performance"""
        status = {
            "deployed_models": list(self.models.keys()),
            "system_config": self.config,
            "model_performance": {}
        }
        
        for model_name, model_info in self.models.items():
            status["model_performance"][model_name] = {
                "fps": model_info["stats"]["fps"],
                "avg_latency_ms": model_info["stats"]["avg_inference_time_ms"],
                "deployed_since": time.time() - model_info["deployed_at"]
            }
        
        return status
    
    def optimize_models_for_device(self, device_constraints: Dict) -> Dict:
        """
        Optimize all models based on device constraints
        
        Args:
            device_constraints: Device memory, compute, and power constraints
            
        Returns:
            Optimization results
        """
        optimizer = EdgeOptimizer()
        results = {}
        
        for model_name, model_config in self.config["models"].items():
            try:
                # Determine optimization strategy based on constraints
                if device_constraints.get("memory_mb", 0) < 1000:
                    # Low memory - aggressive quantization
                    result = optimizer.quantize_model(
                        model_config["path"].replace("_quantized", ""),
                        model_config["path"],
                        "int8"
                    )
                elif device_constraints.get("gpu_available", False):
                    # GPU available - TensorRT optimization
                    if TENSORRT_AVAILABLE:
                        result = optimizer.optimize_for_tensorrt(
                            model_config["path"].replace("_quantized", ""),
                            model_config["path"].replace(".tflite", "_tensorrt"),
                            "FP16"
                        )
                    else:
                        result = {"error": "TensorRT not available"}
                else:
                    # Standard quantization
                    result = optimizer.quantize_model(
                        model_config["path"].replace("_quantized", ""),
                        model_config["path"],
                        "float16"
                    )
                
                results[model_name] = result
                
            except Exception as e:
                results[model_name] = {"error": str(e)}
        
        return results

# Example usage and demonstration
def demonstrate_edge_optimization():
    """Demonstrate edge optimization workflow"""
    print("Edge Optimization Demonstration")
    print("=" * 50)
    
    # Create edge deployment manager
    manager = EdgeDeploymentManager()
    
    # Show system status
    status = manager.get_system_status()
    print(f"System Configuration: {status['system_config']['device_type']}")
    
    # Simulate device constraints
    device_constraints = {
        "memory_mb": 1024,
        "gpu_available": False,
        "max_power_watts": 5
    }
    
    print(f"Device Constraints: {device_constraints}")
    
    # Create sample optimization results
    sample_results = {
        "enhancement": {
            "method": "quantization",
            "quantization_type": "int8",
            "original_size_mb": 45.2,
            "quantized_size_mb": 11.8,
            "compression_ratio": 3.83,
            "size_reduction_percent": 73.9
        },
        "detection": {
            "method": "quantization", 
            "quantization_type": "int8",
            "original_size_mb": 28.7,
            "quantized_size_mb": 7.4,
            "compression_ratio": 3.88,
            "size_reduction_percent": 74.2
        }
    }
    
    print("\nOptimization Results:")
    for model_name, result in sample_results.items():
        print(f"{model_name.capitalize()} Model:")
        print(f"  - Original size: {result['original_size_mb']:.1f} MB")
        print(f"  - Optimized size: {result['quantized_size_mb']:.1f} MB")
        print(f"  - Compression: {result['compression_ratio']:.1f}x")
        print(f"  - Size reduction: {result['size_reduction_percent']:.1f}%")
    
    return sample_results

if __name__ == "__main__":
    demonstrate_edge_optimization()