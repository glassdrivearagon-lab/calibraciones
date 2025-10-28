// app.js - Sistema de Calibraciones ADAS (Técnico en paso final)

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
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.showDashboard();
    }

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

    showDashboard() {
        this.hideAllViews();
        document.getElementById('dashboardView').classList.remove('hidden');
        if (this.currentUser) {
            document.getElementById('currentUser').textContent = this.currentUser.nombre;
        } else {
            document.getElementById('currentUser').textContent = 'Sistema ADAS';
        }
    }

    showNewCalibration() {
        this.hideAllViews();
        this.currentStep = 1;
        this.calibrationData = {
            fecha: new Date().toISOString(),
            estado: 'en_proceso'
        };
        document.getElementById('calibrationWizard').classList.remove('hidden');
        this.renderWizardStep();
    }

    showSearch() {
        this.hideAllViews();
        document.getElementById('searchView').classList.remove('hidden');
        this.populateSearchFilters();
        this.renderSearchResults();
    }

    showHistory() {
        this.hideAllViews();
        document.getElementById('historyView').classList.remove('hidden');
        this.renderHistory();
    }

    hideAllViews() {
        document.getElementById('dashboardView').classList.add('hidden');
        document.getElementById('calibrationWizard').classList.add('hidden');
        document.getElementById('searchView').classList.add('hidden');
        document.getElementById('historyView').classList.add('hidden');
    }

    renderWizardStep() {
        const content = document.getElementById('wizardContent');
        if (!content) return;

        document.querySelectorAll('.wizard-step').forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            step.classList.remove('active', 'completed');
            if (stepNum === this.currentStep) {
                step.classList.add('active');
            } else if (stepNum < this.currentStep) {
                step.classList.add('completed');
            }
        });

        const btnBack = document.getElementById('btnBack');
        if (btnBack) {
            btnBack.style.display = this.currentStep > 1 ? 'block' : 'none';
        }

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

    // PASO 1: Foto del vehículo
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
                <button id="nextStep1" class="btn btn-success btn-full" style="margin-top: 1rem;">
                    Siguiente →
                </button>
            </div>
        `;
    }

    // PASO 2: Datos del vehículo
    renderStep2() {
        const data = this.getStaticData();
        return `
            <div>
                <h3>📄 Datos del Vehículo</h3>
                <p style="margin-bottom: 1rem; color: #757575;">Introduce los datos del vehículo</p>
                
                <div class="form-group">
                    <label class="form-label">Marca</label>
                    <select class="form-control" id="inputMarca">
                        <option value="">Selecciona marca</option>
                        ${data.marcas.map(m => `<option value="${m}">${m}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Modelo</label>
                    <input type="text" class="form-control" id="inputModelo" placeholder="Ej: Golf">
                </div>
                <div class="form-group">
                    <label class="form-label">VIN (Número de Bastidor)</label>
                    <input type="text" class="form-control" id="inputVin" placeholder="17 caracteres" maxlength="17">
                </div>
                <div class="form-group">
                    <label class="form-label">Matrícula</label>
                    <input type="text" class="form-control" id="inputMatricula" placeholder="Ej: 1234ABC">
                </div>
                <div class="form-group">
                    <label class="form-label">Año</label>
                    <input type="number" class="form-control" id="inputYear" placeholder="Ej: 2020" min="1990" max="2030">
                </div>
                <button id="nextStep2" class="btn btn-success btn-full">Siguiente →</button>
            </div>
        `;
    }

    // PASO 3: Datos adicionales
    renderStep3() {
        const data = this.getStaticData();
        return `
            <div>
                <h3>📝 Datos Adicionales</h3>
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
                    <select class="form-control" id="motivoIntervencion">
                        <option value="">Selecciona un motivo</option>
                        ${data.motivosIntervencion.map(m => `<option value="${m}">${m}</option>`).join('')}
                    </select>
                </div>
                <button id="nextStep3" class="btn btn-success btn-full">Siguiente →</button>
            </div>
        `;
    }

    // PASO 4: Equipo
    renderStep4() {
        const data = this.getStaticData();
        return `
            <div>
                <h3>🔧 Equipo de Diagnóstico</h3>
                <p style="margin-bottom: 1rem;">Selecciona el equipo utilizado para la calibración</p>
                <div class="form-group">
                    <label class="form-label">Equipo</label>
                    <select class="form-control" id="equipoDiagnostico">
                        <option value="">Selecciona un equipo</option>
                        ${data.equipos.map(e => 
                            `<option value="${e.id}">${e.fabricante} - ${e.modelo}</option>`
                        ).join('')}
                    </select>
                </div>
                <button id="nextStep4" class="btn btn-success btn-full">Siguiente →</button>
            </div>
        `;
    }

    // PASO 5: Calibración (AHORA INCLUYE SELECCIÓN DE TÉCNICO)
    renderStep5() {
        const data = this.getStaticData();
        const selectedTecnico = this.calibrationData.tecnicoId || '';
        
        return `
            <div>
                <h3>⚙️ Proceso de Calibración</h3>
                
                <!-- SELECCIÓN DE TÉCNICO -->
                <div class="card" style="background: #e3f2fd; margin-bottom: 2rem; padding: 1.5rem;">
                    <h4 style="margin-bottom: 1rem;">👤 Técnico Responsable</h4>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">Selecciona el técnico</label>
                        <select class="form-control" id="selectTecnico">
                            <option value="">-- Selecciona un técnico --</option>
                            ${data.usuarios.map(user => 
                                `<option value="${user.id}" ${user.id === selectedTecnico ? 'selected' : ''}>
                                    ${user.nombre} - ${user.rol}
                                </option>`
                            ).join('')}
                        </select>
                    </div>
                </div>

                <!-- RESUMEN -->
                <div class="card" style="background: #f9f9f9; margin-bottom: 2rem;">
                    <h4 style="margin-bottom: 1rem;">Resumen de la Calibración</h4>
                    <p><strong>Vehículo:</strong> ${this.calibrationData.marca || 'N/A'} ${this.calibrationData.modelo || 'N/A'}</p>
                    <p><strong>Matrícula:</strong> ${this.calibrationData.matricula || 'N/A'}</p>
                    <p><strong>VIN:</strong> ${this.calibrationData.vin || 'N/A'}</p>
                    <p><strong>Motivo:</strong> ${this.calibrationData.motivo || 'N/A'}</p>
                    <p><strong>Equipo:</strong> ${this.calibrationData.equipo || 'N/A'}</p>
                    <p><strong>Inicio:</strong> ${new Date(this.calibrationData.fecha).toLocaleString('es-ES')}</p>
                </div>

                <!-- RESULTADO -->
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

                <!-- SECCIÓN DE PROBLEMAS -->
                <div id="problemSection" class="hidden" style="margin-top: 2rem; padding: 1rem; background: #fff3e0; border-radius: 4px;">
                    <h4>Descripción del Problema</h4>
                    <div class="form-group">
                        <label class="form-label">Problema Encontrado</label>
                        <textarea class="form-control" id="problema" rows="3" placeholder="Describe el problema..."></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Solución Aplicada</label>
                        <textarea class="form-control" id="solucion" rows="3" placeholder="Describe la solución o deja vacío si quedó pendiente..."></textarea>
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

    attachWizardEventListeners() {
        const vehiclePhoto = document.getElementById('vehiclePhoto');
        if (vehiclePhoto) {
            vehiclePhoto.addEventListener('change', (e) => this.handleVehiclePhoto(e));
        }

        ['nextStep1', 'nextStep2', 'nextStep3', 'nextStep4'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => this.nextStep());
            }
        });
    }

    handleVehiclePhoto(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            this.calibrationData.vehiclePhoto = event.target.result;
            document.getElementById('photoPreview').innerHTML = `
                <img src="${event.target.result}" class="photo-preview" alt="Vehículo">
            `;
        };
        reader.readAsDataURL(file);
    }

    nextStep() {
        const data = this.getStaticData();
        
        if (this.currentStep === 2) {
            this.calibrationData.marca = document.getElementById('inputMarca').value;
            this.calibrationData.modelo = document.getElementById('inputModelo').value;
            this.calibrationData.vin = document.getElementById('inputVin').value;
            this.calibrationData.matricula = document.getElementById('inputMatricula').value;
            this.calibrationData.year = document.getElementById('inputYear').value;
        } else if (this.currentStep === 3) {
            this.calibrationData.codigoMotor = document.getElementById('codigoMotor').value;
            this.calibrationData.kilometraje = document.getElementById('kilometraje').value;
            this.calibrationData.motivo = document.getElementById('motivoIntervencion').value;
        } else if (this.currentStep === 4) {
            const equipoId = document.getElementById('equipoDiagnostico').value;
            if (equipoId) {
                this.calibrationData.equipoId = equipoId;
                const equipo = data.equipos.find(e => e.id === equipoId);
                this.calibrationData.equipo = equipo ? `${equipo.fabricante} - ${equipo.modelo}` : 'N/A';
            }
        }

        this.currentStep++;
        this.renderWizardStep();
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.renderWizardStep();
        }
    }

    finishCalibration(isOk) {
        // Guardar técnico seleccionado
        const tecnicoSelect = document.getElementById('selectTecnico');
        if (tecnicoSelect && tecnicoSelect.value) {
            const data = this.getStaticData();
            const tecnico = data.usuarios.find(u => u.id === tecnicoSelect.value);
            if (tecnico) {
                this.calibrationData.tecnico = tecnico.nombre;
                this.calibrationData.tecnicoId = tecnico.id;
                this.calibrationData.taller = tecnico.taller;
                this.currentUser = tecnico;
            }
        }

        if (isOk) {
            this.calibrationData.estado = 'completada';
            this.calibrationData.resultado = 'OK';
            this.calibrationData.fechaFin = new Date().toISOString();
            this.saveCalibrationFinal();
        } else {
            document.getElementById('problemSection').classList.remove('hidden');
        }
    }

    saveCalibration(isResolved) {
        // Guardar técnico seleccionado
        const tecnicoSelect = document.getElementById('selectTecnico');
        if (tecnicoSelect && tecnicoSelect.value) {
            const data = this.getStaticData();
            const tecnico = data.usuarios.find(u => u.id === tecnicoSelect.value);
            if (tecnico) {
                this.calibrationData.tecnico = tecnico.nombre;
                this.calibrationData.tecnicoId = tecnico.id;
                this.calibrationData.taller = tecnico.taller;
                this.currentUser = tecnico;
            }
        }

        const problema = document.getElementById('problema');
        const solucion = document.getElementById('solucion');

        this.calibrationData.problema = problema ? problema.value : '';
        this.calibrationData.solucion = solucion ? solucion.value : '';
        this.calibrationData.fechaFin = new Date().toISOString();
        
        if (isResolved && solucion && solucion.value.trim()) {
            this.calibrationData.estado = 'completada';
            this.calibrationData.resultado = 'OK con incidencias';
        } else {
            this.calibrationData.estado = 'pendiente';
            this.calibrationData.resultado = 'Pendiente';
        }

        this.saveCalibrationFinal();
    }

    saveCalibrationFinal() {
        this.calibrationData.id = 'CAL' + Date.now();
        
        const inicio = new Date(this.calibrationData.fecha);
        const fin = new Date(this.calibrationData.fechaFin);
        const minutos = Math.round((fin - inicio) / 1000 / 60);
        this.calibrationData.tiempoTotal = minutos;
        
        this.calibrations.push(this.calibrationData);
        this.saveData();

        alert('✅ Calibración guardada correctamente');
        this.showDashboard();
    }

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
                    <p><strong>Técnico:</strong> ${cal.tecnico || 'N/A'}</p>
                    <p><strong>Fecha:</strong> ${new Date(cal.fecha).toLocaleDateString('es-ES')}</p>
                    <p><strong>Motivo:</strong> ${cal.motivo || 'N/A'}</p>
                    ${cal.tiempoTotal ? `<p><strong>Tiempo:</strong> ${cal.tiempoTotal} min</p>` : ''}
                    <span class="status-badge status-${cal.estado}">${this.getEstadoText(cal.estado)}</span>
                </div>
            </div>
        `).join('');
    }

    getEstadoText(estado) {
        const estados = {
            'completada': 'Completada',
            'pendiente': 'Pendiente',
            'en_proceso': 'En Proceso'
        };
        return estados[estado] || estado;
    }

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

    clearFilters() {
        document.getElementById('filterMarca').value = '';
        document.getElementById('filterModelo').value = '';
        document.getElementById('filterMatricula').value = '';
        document.getElementById('filterEstado').value = '';
        this.renderSearchResults();
    }

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
                                    <p><strong>Técnico:</strong> ${cal.tecnico || 'N/A'}</p>
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

    saveData() {
        try {
            localStorage.setItem('calibrations', JSON.stringify(this.calibrations));
        } catch (error) {
            console.error('Error al guardar datos:', error);
        }
    }

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

const app = new CalibrationSystem();
