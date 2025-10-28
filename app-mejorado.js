// app.js - Sistema de Calibraciones ADAS (Versión Optimizada con OCR Robusto)

class CalibrationSystem {
    constructor() {
        this.currentUser = null;
        this.currentStep = 1;
        this.calibrationData = {};
        this.calibrations = [];
        
        // Cargar datos guardados
        this.loadData();
        
        // Inicializar
        this.init();
    }

    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.populateUserSelect();
        this.setupEventListeners();
        this.showLoginModal();
    }

    // Datos estáticos
    getStaticData() {
        return {
            usuarios: [
                { id: 'U001', nombre: 'Carlos Rodríguez', rol: 'Técnico Senior', taller: 'T001' },
                { id: 'U002', nombre: 'Israel García', rol: 'Técnico', taller: 'T002' },
                { id: 'U003', nombre: 'Ana Martínez', rol: 'Técnico', taller: 'T001' },
                { id: 'U004', nombre: 'Miguel López', rol: 'Técnico Senior', taller: 'T002' }
            ],
            talleres: [
                { 
                    id: 'T001', 
                    nombre: 'Lunia Zaragoza SL', 
                    direccion: 'Antonio Sangenis 48',
                    ciudad: 'Zaragoza',
                    codigo_postal: '50010',
                    telefono: '976409360',
                    email: 'zaragoza.sangenis@glassdrive.es'
                },
                { 
                    id: 'T002', 
                    nombre: 'Lunia Zaragoza Plaza', 
                    direccion: 'C/Batalla de Lepanto, 24',
                    ciudad: 'Zaragoza',
                    codigo_postal: '50002',
                    telefono: '607752465',
                    email: 'zaragoza.plaza@glassdrive.es'
                }
            ],
            equipos: [
                { 
                    id: 'E001', 
                    fabricante: 'Hella Gutmann Solutions', 
                    modelo: 'mega macs 42 SE',
                    marcas: ['Volkswagen', 'Audi', 'Seat', 'Skoda']
                },
                { 
                    id: 'E002', 
                    fabricante: 'TEXA', 
                    modelo: 'AXONE S',
                    marcas: ['Volkswagen', 'Audi', 'Mercedes-Benz', 'BMW']
                },
                { 
                    id: 'E003', 
                    fabricante: 'Bosch', 
                    modelo: 'KTS 590',
                    marcas: ['Volkswagen', 'Mercedes-Benz', 'BMW']
                }
            ],
            marcas: ['Volkswagen', 'Audi', 'Mercedes-Benz', 'BMW', 'Seat', 'Skoda', 'Peugeot', 'Citroën', 'Renault', 'Ford', 'Opel'],
            motivosIntervencion: [
                'Sustitución del parabrisas',
                'Reparación tras accidente',
                'Calibración periódica',
                'Fallo en sistema ADAS',
                'Cambio de centralita',
                'Actualización de software',
                'Verificación post-reparación'
            ]
        };
    }

    // Poblar selector de usuarios
    populateUserSelect() {
        const select = document.getElementById('userSelect');
        if (!select) return;
        
        const data = this.getStaticData();
        data.usuarios.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.nombre} - ${user.rol}`;
            select.appendChild(option);
        });
    }

    // Event Listeners
    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    // Mostrar modal de login
    showLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    // Manejar login
    handleLogin(e) {
        e.preventDefault();
        const userId = document.getElementById('userSelect').value;
        
        if (!userId) {
            alert('Por favor selecciona un técnico');
            return;
        }

        const data = this.getStaticData();
        this.currentUser = data.usuarios.find(u => u.id === userId);
        
        if (this.currentUser) {
            document.getElementById('currentUser').textContent = this.currentUser.nombre;
            document.getElementById('loginModal').classList.remove('active');
            this.showDashboard();
        }
    }

    // Mostrar dashboard
    showDashboard() {
        this.hideAllViews();
        document.getElementById('dashboardView').classList.remove('hidden');
    }

    // Mostrar nueva calibración
    showNewCalibration() {
        this.hideAllViews();
        this.currentStep = 1;
        this.calibrationData = {
            tecnico: this.currentUser.nombre,
            tecnicoId: this.currentUser.id,
            taller: this.currentUser.taller,
            fecha: new Date().toISOString(),
            estado: 'en_proceso'
        };
        document.getElementById('calibrationWizard').classList.remove('hidden');
        this.renderWizardStep();
    }

    // Mostrar búsqueda
    showSearch() {
        this.hideAllViews();
        document.getElementById('searchView').classList.remove('hidden');
        this.populateSearchFilters();
        this.renderSearchResults();
    }

    // Mostrar histórico
    showHistory() {
        this.hideAllViews();
        document.getElementById('historyView').classList.remove('hidden');
        this.renderHistory();
    }

    // Ocultar todas las vistas
    hideAllViews() {
        document.getElementById('dashboardView').classList.add('hidden');
        document.getElementById('calibrationWizard').classList.add('hidden');
        document.getElementById('searchView').classList.add('hidden');
        document.getElementById('historyView').classList.add('hidden');
    }

    // Renderizar paso del wizard
    renderWizardStep() {
        const content = document.getElementById('wizardContent');
        if (!content) return;

        // Actualizar indicadores de paso
        document.querySelectorAll('.wizard-step').forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            step.classList.remove('active', 'completed');
            if (stepNum === this.currentStep) {
                step.classList.add('active');
            } else if (stepNum < this.currentStep) {
                step.classList.add('completed');
            }
        });

        // Mostrar/ocultar botón atrás
        const btnBack = document.getElementById('btnBack');
        if (btnBack) {
            btnBack.style.display = this.currentStep > 1 ? 'block' : 'none';
        }

        // Renderizar contenido según paso
        switch(this.currentStep) {
            case 1:
                content.innerHTML = this.renderStep1();
                break;
            case 2:
                content.innerHTML = this.renderStep2();
                break;
            case 3:
                content.innerHTML = this.renderStep3();
                break;
            case 4:
                content.innerHTML = this.renderStep4();
                break;
            case 5:
                content.innerHTML = this.renderStep5();
                break;
        }

        this.attachWizardEventListeners();
    }

    // Paso 1: Foto del vehículo
    renderStep1() {
        return `
            <div class="photo-capture">
                <h3>📷 Captura Foto Frontal del Vehículo</h3>
                <p>Toma una foto clara del vehículo desde el frente</p>
                <input type="file" id="vehiclePhoto" accept="image/*" capture="environment" style="display:none">
                <button class="btn btn-primary btn-large" onclick="document.getElementById('vehiclePhoto').click()">
                    📸 Capturar Foto
                </button>
                <div id="photoPreview"></div>
                <button id="nextStep1" class="btn btn-success btn-full hidden" style="margin-top: 1rem;">
                    Siguiente →
                </button>
            </div>
        `;
    }

    // Paso 2: Ficha técnica con OCR
    renderStep2() {
        return `
            <div class="photo-capture">
                <h3>📄 Captura Ficha Técnica</h3>
                <p>Fotografía la ficha técnica del vehículo para extraer los datos automáticamente</p>
                <input type="file" id="technicalSheet" accept="image/*" capture="environment" style="display:none">
                <button class="btn btn-primary btn-large" onclick="document.getElementById('technicalSheet').click()">
                    📸 Capturar Ficha
                </button>
                <div id="sheetPreview"></div>
                <div id="ocrLoading" class="loading hidden">
                    <div class="spinner"></div>
                    <p>Extrayendo datos con OCR...</p>
                    <p style="font-size: 0.9rem; color: #757575;">Esto puede tardar unos segundos</p>
                </div>
                <div id="ocrResult" class="ocr-result hidden">
                    <h4>Datos Extraídos (editar si es necesario):</h4>
                    <div class="form-group">
                        <label class="form-label">Marca</label>
                        <input type="text" class="form-control" id="ocrMarca" placeholder="Ej: Volkswagen">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Modelo</label>
                        <input type="text" class="form-control" id="ocrModelo" placeholder="Ej: Golf">
                    </div>
                    <div class="form-group">
                        <label class="form-label">VIN (Número de Bastidor)</label>
                        <input type="text" class="form-control" id="ocrVin" placeholder="17 caracteres" maxlength="17">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Matrícula</label>
                        <input type="text" class="form-control" id="ocrMatricula" placeholder="Ej: 1234ABC">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Año</label>
                        <input type="text" class="form-control" id="ocrYear" placeholder="Ej: 2020">
                    </div>
                    <button id="nextStep2" class="btn btn-success btn-full">Siguiente →</button>
                </div>
            </div>
        `;
    }

    // Paso 3: Datos adicionales
    renderStep3() {
        const data = this.getStaticData();
        return `
            <div>
                <h3>📝 Datos Adicionales del Vehículo</h3>
                <div class="form-group">
                    <label class="form-label">Código Motor</label>
                    <input type="text" class="form-control" id="codigoMotor" placeholder="Ej: DLAA">
                </div>
                <div class="form-group">
                    <label class="form-label">Kilometraje</label>
                    <input type="number" class="form-control" id="kilometraje" placeholder="Ej: 64836">
                </div>
                <div class="form-group">
                    <label class="form-label">Motivo de Intervención</label>
                    <select class="form-control" id="motivoIntervencion" required>
                        <option value="">Selecciona un motivo</option>
                        ${data.motivosIntervencion.map(m => `<option value="${m}">${m}</option>`).join('')}
                    </select>
                </div>
                <button id="nextStep3" class="btn btn-success btn-full">Siguiente →</button>
            </div>
        `;
    }

    // Paso 4: Selección de equipo
    renderStep4() {
        const data = this.getStaticData();
        const marca = this.calibrationData.marca || '';
        const equiposCompatibles = data.equipos.filter(e => 
            !marca || e.marcas.includes(marca)
        );

        return `
            <div>
                <h3>🔧 Selección de Equipo de Calibración</h3>
                <p style="margin-bottom: 1rem;">
                    ${marca ? `Equipos compatibles con <strong>${marca}</strong>` : 'Selecciona el equipo utilizado'}
                </p>
                <div class="form-group">
                    <label class="form-label">Equipo de Diagnóstico</label>
                    <select class="form-control" id="equipoDiagnostico" required>
                        <option value="">Selecciona un equipo</option>
                        ${equiposCompatibles.map(e => 
                            `<option value="${e.id}">${e.fabricante} - ${e.modelo}</option>`
                        ).join('')}
                    </select>
                </div>
                ${equiposCompatibles.length === 0 ? 
                    '<p style="color: #e65100;">⚠️ No hay equipos compatibles registrados para esta marca</p>' : 
                    ''}
                <button id="nextStep4" class="btn btn-success btn-full">Iniciar Calibración →</button>
            </div>
        `;
    }

    // Paso 5: Proceso de calibración
    renderStep5() {
        const data = this.getStaticData();
        const taller = data.talleres.find(t => t.id === this.currentUser.taller);
        
        return `
            <div>
                <h3>⚙️ Proceso de Calibración</h3>
                <div class="card" style="background: #f9f9f9; margin-bottom: 2rem;">
                    <h4 style="margin-bottom: 1rem;">Resumen de la Calibración</h4>
                    <p><strong>Técnico:</strong> ${this.calibrationData.tecnico}</p>
                    <p><strong>Taller:</strong> ${taller ? taller.nombre : 'N/A'}</p>
                    <p><strong>Vehículo:</strong> ${this.calibrationData.marca} ${this.calibrationData.modelo}</p>
                    <p><strong>Matrícula:</strong> ${this.calibrationData.matricula}</p>
                    <p><strong>VIN:</strong> ${this.calibrationData.vin || 'N/A'}</p>
                    <p><strong>Motivo:</strong> ${this.calibrationData.motivo}</p>
                    <p><strong>Inicio:</strong> ${new Date(this.calibrationData.fecha).toLocaleString('es-ES')}</p>
                </div>
                <div style="margin-top: 2rem;">
                    <h4>¿Calibración Exitosa?</h4>
                    <p style="color: #757575; margin-bottom: 1rem;">Indica si la calibración se completó correctamente</p>
                    <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                        <button class="btn btn-success" onclick="app.finishCalibration(true)" style="flex: 1;">
                            ✅ SÍ - Calibración OK
                        </button>
                        <button class="btn btn-error" onclick="app.finishCalibration(false)" style="flex: 1;">
                            ❌ NO - Con Problemas
                        </button>
                    </div>
                </div>
                <div id="problemSection" class="hidden" style="margin-top: 2rem; padding: 1rem; background: #fff3e0; border-radius: 4px;">
                    <h4>Descripción del Problema</h4>
                    <div class="form-group">
                        <label class="form-label">Problema Encontrado</label>
                        <textarea class="form-control" id="problema" rows="3" placeholder="Describe el problema encontrado..."></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Solución Aplicada</label>
                        <textarea class="form-control" id="solucion" rows="3" placeholder="Describe la solución aplicada o deja vacío si quedó pendiente..."></textarea>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <button class="btn btn-success btn-full" onclick="app.saveCalibration(true)">
                            💾 Guardar como Resuelta
                        </button>
                        <button class="btn btn-error btn-full" onclick="app.saveCalibration(false)">
                            ⏳ Guardar como Pendiente
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Adjuntar event listeners del wizard
    attachWizardEventListeners() {
        // Paso 1: Foto del vehículo
        const vehiclePhoto = document.getElementById('vehiclePhoto');
        if (vehiclePhoto) {
            vehiclePhoto.addEventListener('change', (e) => this.handleVehiclePhoto(e));
        }

        // Paso 2: Ficha técnica
        const technicalSheet = document.getElementById('technicalSheet');
        if (technicalSheet) {
            technicalSheet.addEventListener('change', (e) => this.handleTechnicalSheet(e));
        }

        // Botones siguiente
        ['nextStep1', 'nextStep2', 'nextStep3', 'nextStep4'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => this.nextStep());
            }
        });
    }

    // Manejar foto del vehículo
    handleVehiclePhoto(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            this.calibrationData.vehiclePhoto = event.target.result;
            document.getElementById('photoPreview').innerHTML = `
                <img src="${event.target.result}" class="photo-preview" alt="Vehículo">
            `;
            document.getElementById('nextStep1').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }

    // FUNCIÓN MEJORADA: Redimensionar imagen antes de OCR
    resizeImage(base64, maxWidth = 800) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = function() {
                const scale = Math.min(1, maxWidth / img.width);
                const canvas = document.createElement('canvas');
                canvas.width = Math.floor(img.width * scale);
                canvas.height = Math.floor(img.height * scale);
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.85));
            };
            img.src = base64;
        });
    }

    // FUNCIÓN MEJORADA: Manejar ficha técnica con OCR robusto
    async handleTechnicalSheet(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            this.calibrationData.technicalSheetPhoto = event.target.result;
            
            // Mostrar preview
            document.getElementById('sheetPreview').innerHTML = `
                <img src="${event.target.result}" class="photo-preview" alt="Ficha Técnica">
            `;

            // Mostrar loading
            const loadingEl = document.getElementById('ocrLoading');
            loadingEl.classList.remove('hidden');
            loadingEl.innerHTML = `
                <div class="spinner"></div>
                <p>Procesando imagen...</p>
                <p style="font-size: 0.85rem; color: #757575;">Redimensionando para mejor rendimiento</p>
            `;

            try {
                // Redimensionar imagen antes del OCR (mejora velocidad y evita bloqueos)
                const resizedBase64 = await this.resizeImage(event.target.result, 800);
                
                loadingEl.innerHTML = `
                    <div class="spinner"></div>
                    <p>Extrayendo datos con OCR...</p>
                    <p style="font-size: 0.85rem; color: #757575;">Esto puede tardar 10-30 segundos</p>
                    <p style="font-size: 0.85rem; color: #e65100;">Si tarda más, intenta con una imagen más clara</p>
                `;

                // Timeout de seguridad (30 segundos)
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('timeout')), 30000)
                );

                // Ejecutar OCR con timeout
                const ocrPromise = Tesseract.recognize(resizedBase64, 'spa+eng', {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            loadingEl.innerHTML = `
                                <div class="spinner"></div>
                                <p>Reconociendo texto... ${Math.round(m.progress * 100)}%</p>
                            `;
                        }
                    }
                });

                const result = await Promise.race([ocrPromise, timeoutPromise]);
                
                const text = result.data.text;
                console.log('Texto extraído:', text);
                this.extractDataFromOCR(text);
                
                loadingEl.classList.add('hidden');
                document.getElementById('ocrResult').classList.remove('hidden');
                
            } catch (error) {
                console.error('Error OCR:', error);
                loadingEl.classList.add('hidden');
                document.getElementById('ocrResult').classList.remove('hidden');
                
                if (error.message === 'timeout') {
                    alert('⏱️ El proceso de OCR tardó demasiado.\n\nPor favor:\n- Toma una foto con mejor iluminación\n- Asegúrate que el texto sea legible\n- O introduce los datos manualmente');
                } else {
                    alert('❌ Error al procesar la imagen.\n\nPuedes:\n- Intentar de nuevo con otra foto\n- Introducir los datos manualmente');
                }
            }
        };
        reader.readAsDataURL(file);
    }

    // Extraer datos del texto OCR
    extractDataFromOCR(text) {
        // Expresiones regulares para identificar datos
        const vinRegex = /[A-HJ-NPR-Z0-9]{17}/;
        const matriculaRegex = /\b[0-9]{4}\s*[BCDFGHJKLMNPRSTVWXYZ]{3}\b/i;
        const yearRegex = /\b(19|20)\d{2}\b/;

        // Extraer VIN
        const vinMatch = text.match(vinRegex);
        if (vinMatch) {
            this.calibrationData.vin = vinMatch[0];
            document.getElementById('ocrVin').value = vinMatch[0];
        }

        // Extraer matrícula
        const matriculaMatch = text.match(matriculaRegex);
        if (matriculaMatch) {
            const matricula = matriculaMatch[0].replace(/\s/g, '');
            this.calibrationData.matricula = matricula;
            document.getElementById('ocrMatricula').value = matricula;
        }

        // Extraer año
        const yearMatches = text.match(new RegExp(yearRegex, 'g'));
        if (yearMatches && yearMatches.length > 0) {
            const years = yearMatches.map(y => parseInt(y)).sort((a, b) => b - a);
            this.calibrationData.year = years[0].toString();
            document.getElementById('ocrYear').value = years[0];
        }

        // Intentar identificar marca
        const data = this.getStaticData();
        for (const marca of data.marcas) {
            if (text.toUpperCase().includes(marca.toUpperCase())) {
                this.calibrationData.marca = marca;
                document.getElementById('ocrMarca').value = marca;
                break;
            }
        }

        // Si no se encontró nada, mostrar mensaje
        if (!vinMatch && !matriculaMatch && !yearMatches) {
            console.warn('No se pudieron extraer datos automáticamente');
            // No mostramos alert aquí para no interrumpir el flujo
        }
    }

    // Siguiente paso
    nextStep() {
        // Guardar datos del paso actual
        if (this.currentStep === 2) {
            this.calibrationData.marca = document.getElementById('ocrMarca').value;
            this.calibrationData.modelo = document.getElementById('ocrModelo').value;
            this.calibrationData.vin = document.getElementById('ocrVin').value;
            this.calibrationData.matricula = document.getElementById('ocrMatricula').value;
            this.calibrationData.year = document.getElementById('ocrYear').value;

            if (!this.calibrationData.marca || !this.calibrationData.modelo || !this.calibrationData.matricula) {
                alert('Por favor completa al menos Marca, Modelo y Matrícula');
                return;
            }
        } else if (this.currentStep === 3) {
            this.calibrationData.codigoMotor = document.getElementById('codigoMotor').value;
            this.calibrationData.kilometraje = document.getElementById('kilometraje').value;
            this.calibrationData.motivo = document.getElementById('motivoIntervencion').value;

            if (!this.calibrationData.motivo) {
                alert('Por favor selecciona un motivo de intervención');
                return;
            }
        } else if (this.currentStep === 4) {
            const equipoId = document.getElementById('equipoDiagnostico').value;
            if (!equipoId) {
                alert('Por favor selecciona un equipo de diagnóstico');
                return;
            }
            this.calibrationData.equipoId = equipoId;
            const data = this.getStaticData();
            const equipo = data.equipos.find(e => e.id === equipoId);
            this.calibrationData.equipo = equipo ? `${equipo.fabricante} - ${equipo.modelo}` : 'N/A';
        }

        this.currentStep++;
        this.renderWizardStep();
    }

    // Paso anterior
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.renderWizardStep();
        }
    }

    // Finalizar calibración
    finishCalibration(isOk) {
        if (isOk) {
            this.calibrationData.estado = 'completada';
            this.calibrationData.resultado = 'OK';
            this.calibrationData.fechaFin = new Date().toISOString();
            this.saveCalibrationFinal();
        } else {
            document.getElementById('problemSection').classList.remove('hidden');
        }
    }

    // Guardar calibración
    saveCalibration(isResolved) {
        const problema = document.getElementById('problema');
        const solucion = document.getElementById('solucion');

        if (!problema || !problema.value.trim()) {
            alert('Por favor describe el problema encontrado');
            return;
        }

        this.calibrationData.problema = problema.value;
        this.calibrationData.solucion = solucion.value;
        this.calibrationData.fechaFin = new Date().toISOString();
        
        if (isResolved && solucion.value.trim()) {
            this.calibrationData.estado = 'completada';
            this.calibrationData.resultado = 'OK con incidencias';
        } else {
            this.calibrationData.estado = 'pendiente';
            this.calibrationData.resultado = 'Pendiente';
        }

        this.saveCalibrationFinal();
    }

    // Guardar calibración final
    saveCalibrationFinal() {
        this.calibrationData.id = 'CAL' + Date.now();
        
        // Calcular tiempo transcurrido
        const inicio = new Date(this.calibrationData.fecha);
        const fin = new Date(this.calibrationData.fechaFin);
        const minutos = Math.round((fin - inicio) / 1000 / 60);
        this.calibrationData.tiempoTotal = minutos;
        
        this.calibrations.push(this.calibrationData);
        this.saveData();

        alert('✅ Calibración guardada correctamente');
        this.showDashboard();
    }

    // Poblar filtros de búsqueda
    populateSearchFilters() {
        const marcas = [...new Set(this.calibrations.map(c => c.marca).filter(m => m))];
        const filterMarca = document.getElementById('filterMarca');
        if (filterMarca) {
            filterMarca.innerHTML = '<option value="">Todas</option>';
            marcas.forEach(marca => {
                filterMarca.innerHTML += `<option value="${marca}">${marca}</option>`;
            });
        }

        const modelos = [...new Set(this.calibrations.map(c => c.modelo).filter(m => m))];
        const filterModelo = document.getElementById('filterModelo');
        if (filterModelo) {
            filterModelo.innerHTML = '<option value="">Todos</option>';
            modelos.forEach(modelo => {
                filterModelo.innerHTML += `<option value="${modelo}">${modelo}</option>`;
            });
        }
    }

    // Renderizar resultados de búsqueda
    renderSearchResults(filteredCalibrations = null) {
        const results = filteredCalibrations || this.calibrations;
        const container = document.getElementById('searchResults');
        
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #757575;">No se encontraron calibraciones</p>';
            return;
        }

        container.innerHTML = results.slice().reverse().map(cal => `
            <div class="result-card">
                ${cal.vehiclePhoto ? 
                    `<img src="${cal.vehiclePhoto}" class="result-thumbnail" alt="Vehículo">` : 
                    '<div class="result-thumbnail" style="display: flex; align-items: center; justify-content: center; color: #757575;">Sin foto</div>'
                }
                <div class="result-info">
                    <h4>${cal.marca || 'N/A'} ${cal.modelo || 'N/A'}</h4>
                    <p><strong>Matrícula:</strong> ${cal.matricula || 'N/A'}</p>
                    <p><strong>VIN:</strong> ${cal.vin || 'N/A'}</p>
                    <p><strong>Técnico:</strong> ${cal.tecnico}</p>
                    <p><strong>Fecha:</strong> ${new Date(cal.fecha).toLocaleDateString('es-ES')}</p>
                    <p><strong>Motivo:</strong> ${cal.motivo || 'N/A'}</p>
                    ${cal.tiempoTotal ? `<p><strong>Tiempo:</strong> ${cal.tiempoTotal} min</p>` : ''}
                    <span class="status-badge status-${cal.estado}">${this.getEstadoText(cal.estado)}</span>
                </div>
            </div>
        `).join('');
    }

    // Obtener texto del estado
    getEstadoText(estado) {
        const estados = {
            'completada': 'Completada',
            'pendiente': 'Pendiente',
            'en_proceso': 'En Proceso'
        };
        return estados[estado] || estado;
    }

    // Aplicar filtros
    applyFilters() {
        const marca = document.getElementById('filterMarca').value;
        const modelo = document.getElementById('filterModelo').value;
        const matricula = document.getElementById('filterMatricula').value.toUpperCase();
        const estado = document.getElementById('filterEstado').value;

        const filtered = this.calibrations.filter(cal => {
            return (!marca || cal.marca === marca) &&
                   (!modelo || cal.modelo === modelo) &&
                   (!matricula || (cal.matricula && cal.matricula.toUpperCase().includes(matricula))) &&
                   (!estado || cal.estado === estado);
        });

        this.renderSearchResults(filtered);
    }

    // Limpiar filtros
    clearFilters() {
        document.getElementById('filterMarca').value = '';
        document.getElementById('filterModelo').value = '';
        document.getElementById('filterMatricula').value = '';
        document.getElementById('filterEstado').value = '';
        this.renderSearchResults();
    }

    // Renderizar histórico
    renderHistory() {
        const container = document.getElementById('historyContent');
        if (!container) return;

        const total = this.calibrations.length;
        const completadas = this.calibrations.filter(c => c.estado === 'completada').length;
        const pendientes = this.calibrations.filter(c => c.estado === 'pendiente').length;

        container.innerHTML = `
            <div class="dashboard">
                <div class="card">
                    <div class="card-icon">📊</div>
                    <div class="card-title">${total}</div>
                    <div class="card-description">Total Calibraciones</div>
                </div>
                <div class="card">
                    <div class="card-icon">✅</div>
                    <div class="card-title">${completadas}</div>
                    <div class="card-description">Completadas</div>
                </div>
                <div class="card">
                    <div class="card-icon">⏳</div>
                    <div class="card-title">${pendientes}</div>
                    <div class="card-description">Pendientes</div>
                </div>
            </div>
            <div style="margin-top: 2rem;">
                <h3>Últimas Calibraciones</h3>
                ${total === 0 ? 
                    '<p style="text-align: center; padding: 2rem; color: #757575;">No hay calibraciones registradas</p>' :
                    `<div class="results-list">
                        ${this.calibrations.slice(-10).reverse().map(cal => `
                            <div class="result-card">
                                <div class="result-info">
                                    <h4>${cal.marca || 'N/A'} ${cal.modelo || 'N/A'} - ${cal.matricula || 'N/A'}</h4>
                                    <p><strong>Técnico:</strong> ${cal.tecnico}</p>
                                    <p><strong>Fecha:</strong> ${new Date(cal.fecha).toLocaleString('es-ES')}</p>
                                    <p><strong>Motivo:</strong> ${cal.motivo || 'N/A'}</p>
                                    ${cal.tiempoTotal ? `<p><strong>Tiempo:</strong> ${cal.tiempoTotal} minutos</p>` : ''}
                                    <span class="status-badge status-${cal.estado}">${this.getEstadoText(cal.estado)}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>`
                }
            </div>
        `;
    }

    // Guardar datos en localStorage
    saveData() {
        try {
            localStorage.setItem('calibrations', JSON.stringify(this.calibrations));
        } catch (error) {
            console.error('Error al guardar datos:', error);
            alert('Error al guardar los datos. El almacenamiento puede estar lleno.');
        }
    }

    // Cargar datos de localStorage
    loadData() {
        try {
            const saved = localStorage.getItem('calibrations');
            if (saved) {
                this.calibrations = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
            this.calibrations = [];
        }
    }
}

// Inicializar la aplicación
const app = new CalibrationSystem();