# Crear base de datos de compatibilidad de equipos con vehículos
import json

# Base de datos de compatibilidad basada en los informes reales
compatibility_database = {
    "compatibilidad_equipos": {
        "Volkswagen": {
            "modelos": ["Golf", "Taigo", "Polo", "Tiguan", "Passat", "Arteon"],
            "sistemas_adas": ["Cámara frontal", "ACC", "LDW", "AEB", "BSD"],
            "equipos_compatibles": [
                {
                    "fabricante": "Hella Gutmann Solutions",
                    "modelos": ["mega macs 42 SE", "mega macs 56", "mega macs X"],
                    "tipos_calibracion": ["CAM_DIN", "CAM_EST", "RADAR_ACC"],
                    "cobertura": "Completa"
                },
                {
                    "fabricante": "TEXA",
                    "modelos": ["AXONE S", "NAVIGATOR TXTs", "KONFORT 705R"],
                    "tipos_calibracion": ["CAM_EST", "RADAR_ACC"],
                    "cobertura": "Completa"
                },
                {
                    "fabricante": "Bosch",
                    "modelos": ["KTS 560", "KTS 590", "FSA 500"],
                    "tipos_calibracion": ["CAM_DIN", "CAM_EST"],
                    "cobertura": "Parcial"
                }
            ]
        },
        "Mercedes-Benz": {
            "modelos": ["Clase A", "Clase B", "Clase C", "Clase E", "GLA", "GLC"],
            "sistemas_adas": ["Cámara frontal", "ACC", "LDW", "AEB", "BSD", "LiDAR"],
            "equipos_compatibles": [
                {
                    "fabricante": "Mercedes-Benz",
                    "modelos": ["XENTRY Diagnosis", "DAS/SMR"],
                    "tipos_calibracion": ["CAM_EST", "RADAR_ACC", "LIDAR_CAL"],
                    "cobertura": "Completa"
                },
                {
                    "fabricante": "TEXA",
                    "modelos": ["AXONE S", "NAVIGATOR TXTs"],
                    "tipos_calibracion": ["CAM_EST", "RADAR_ACC"],
                    "cobertura": "Completa"
                },
                {
                    "fabricante": "Hella Gutmann Solutions", 
                    "modelos": ["mega macs 56", "mega macs X"],
                    "tipos_calibracion": ["CAM_DIN", "CAM_EST"],
                    "cobertura": "Parcial"
                }
            ]
        },
        "BMW": {
            "modelos": ["Serie 1", "Serie 3", "Serie 5", "X1", "X3", "X5"],
            "sistemas_adas": ["Cámara frontal", "ACC", "LDW", "AEB", "BSD"],
            "equipos_compatibles": [
                {
                    "fabricante": "BMW",
                    "modelos": ["ISTA/D", "ISTA/P"],
                    "tipos_calibracion": ["CAM_EST", "RADAR_ACC"],
                    "cobertura": "Completa"
                },
                {
                    "fabricante": "TEXA",
                    "modelos": ["AXONE S", "NAVIGATOR TXTs"],
                    "tipos_calibracion": ["CAM_EST", "RADAR_ACC"], 
                    "cobertura": "Completa"
                },
                {
                    "fabricante": "Hella Gutmann Solutions",
                    "modelos": ["mega macs 56", "mega macs X"],
                    "tipos_calibracion": ["CAM_DIN", "CAM_EST"],
                    "cobertura": "Parcial"
                }
            ]
        },
        "Audi": {
            "modelos": ["A3", "A4", "A6", "Q3", "Q5", "Q7"],
            "sistemas_adas": ["Cámara frontal", "ACC", "LDW", "AEB", "BSD"],
            "equipos_compatibles": [
                {
                    "fabricante": "VAG",
                    "modelos": ["ODIS", "VAS 5054A"],
                    "tipos_calibracion": ["CAM_EST", "RADAR_ACC"],
                    "cobertura": "Completa"
                },
                {
                    "fabricante": "TEXA",
                    "modelos": ["AXONE S", "NAVIGATOR TXTs"],
                    "tipos_calibracion": ["CAM_EST", "RADAR_ACC"],
                    "cobertura": "Completa"
                },
                {
                    "fabricante": "Hella Gutmann Solutions",
                    "modelos": ["mega macs 56", "mega macs X"],
                    "tipos_calibracion": ["CAM_DIN", "CAM_EST"],
                    "cobertura": "Parcial"
                }
            ]
        }
    },
    "especificaciones_calibracion": {
        "CAM_DIN": {
            "nombre": "Calibración Dinámica de Cámara",
            "descripcion": "Calibración en movimiento con recorrido específico",
            "requisitos": ["Espacio mínimo 100m", "Velocidad 30-50 km/h", "Condiciones climatológicas estables"],
            "precision": "±0.1°",
            "tiempo_estimado": "10-20 minutos"
        },
        "CAM_EST": {
            "nombre": "Calibración Estática de Cámara", 
            "descripcion": "Calibración con dianas estáticas",
            "requisitos": ["Diana de calibración", "Superficie plana", "Iluminación adecuada"],
            "precision": "±0.05°",
            "tiempo_estimado": "20-45 minutos"
        },
        "RADAR_ACC": {
            "nombre": "Calibración Radar ACC",
            "descripcion": "Calibración del sistema de Control de Crucero Adaptativo",
            "requisitos": ["Reflector específico", "Alineación precisa", "Sin obstáculos"],
            "precision": "±0.5°",
            "tiempo_estimado": "30-60 minutos"
        }
    }
}

# Función para obtener equipos compatibles con un vehículo específico
def get_compatible_equipment(marca, modelo, sistemas_adas):
    """
    Obtiene los equipos compatibles para un vehículo específico
    """
    compatible_equipment = []
    
    if marca in compatibility_database["compatibilidad_equipos"]:
        brand_data = compatibility_database["compatibilidad_equipos"][marca]
        
        # Verificar si el modelo está soportado
        model_supported = any(model_name.lower() in modelo.lower() for model_name in brand_data["modelos"])
        
        if model_supported:
            for equipo in brand_data["equipos_compatibles"]:
                # Verificar compatibilidad de sistemas ADAS
                sistemas_compatibles = []
                for sistema in sistemas_adas:
                    if sistema in brand_data["sistemas_adas"]:
                        sistemas_compatibles.append(sistema)
                
                if sistemas_compatibles:
                    equipo_info = {
                        "fabricante": equipo["fabricante"],
                        "modelos": equipo["modelos"], 
                        "tipos_calibracion": equipo["tipos_calibracion"],
                        "cobertura": equipo["cobertura"],
                        "sistemas_compatibles": sistemas_compatibles
                    }
                    compatible_equipment.append(equipo_info)
    
    return compatible_equipment

# Ejemplo de uso con los vehículos de los informes
vehiculo_taigo = get_compatible_equipment("Volkswagen", "Taigo", ["Cámara frontal", "ACC", "LDW", "AEB"])
vehiculo_golf = get_compatible_equipment("Volkswagen", "Golf VII", ["Cámara frontal", "ACC", "LDW", "AVM"])

print("Equipos compatibles con Volkswagen Taigo:")
for equipo in vehiculo_taigo:
    print(f"- {equipo['fabricante']}: {', '.join(equipo['modelos'])} ({equipo['cobertura']})")

print("\nEquipos compatibles con Volkswagen Golf VII:")
for equipo in vehiculo_golf:
    print(f"- {equipo['fabricante']}: {', '.join(equipo['modelos'])} ({equipo['cobertura']})")

# Guardar la base de datos de compatibilidad
with open('compatibility_database.json', 'w', encoding='utf-8') as f:
    json.dump(compatibility_database, f, indent=2, ensure_ascii=False)

print(f"\nBase de datos de compatibilidad creada: {len(compatibility_database['compatibilidad_equipos'])} marcas")
print(f"Especificaciones de calibración: {len(compatibility_database['especificaciones_calibracion'])} tipos")