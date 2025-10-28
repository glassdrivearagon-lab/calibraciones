// app.js - Sistema de Calibraciones ADAS FINAL

class CalibrationSystem {
    constructor() {
        this.currentUser = null;
        this.currentStep = 1;
        this.calibrationData = {};
        this.calibrations = [];
        this.loadData();
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
                { id: 'T001', nombre: 'Lunia Zaragoza SL', direccion: 'Antonio Sangenis 48', ciudad: 'Zaragoza', codigo_postal: '50010', telefono: '976409360', email: 'zaragoza.sangenis@glassdrive.es' },
                { id: 'T002', nombre: 'Lunia Zaragoza Plaza', direccion: 'C/Batalla de Lepanto, 24', ciudad: 'Zaragoza', codigo_postal: '50002', telefono: '607752465', email: 'zaragoza.plaza@glassdrive.es' }
            ],
            equipos: [
                { id: 'E001', fabricante: 'Hella Gutmann Solutions', modelo: 'mega macs 42 SE', marcas: ['Volkswagen', 'Audi', 'Seat', 'Skoda'] },
                { id: 'E002', fabricante: 'TEXA', modelo: 'AXONE S', marcas: ['Volkswagen', 'Audi', 'Mercedes-Benz', 'BMW'] },
                { id: 'E003', fabricante: 'Bosch', modelo: 'KTS 590', marcas: ['Volkswagen', 'Mercedes-Benz', 'BMW'] },
                { id: 'E004', fabricante: 'Launch', modelo: 'X-431 ADAS PRO', marcas: ['Volkswagen', 'Audi', 'Mercedes-Benz', 'BMW', 'Seat', 'Skoda', 'Peugeot', 'Citroën', 'Renault', 'Ford', 'Opel'] }
            ],
            marcas: ['Volkswagen', 'Audi', 'Mercedes-Benz', 'BMW', 'Seat', 'Skoda', 'Peugeot', 'Citroën', 'Renault', 'Ford', 'Opel'],
            motivosIntervencion: ['Sustitución del parabrisas', 'Reparación tras accidente', 'Calibración periódica', 'Fallo en sistema ADAS', 'Cambio de centralita', 'Actualización de software', 'Verificación post-reparación']
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
        this.calibrationData = { fecha: new Date().toISOString(), estado: 'en_proceso' };
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
            case 1: content.innerHTML = this.renderStep1(); break;
            case 2: content.innerHTML = this.renderStep2(); break;
            case 3: content.innerHTML = this.renderStep3(); break;
            case 4: content.innerHTML = this.renderStep4(); break;
        }
        this.attachWizardEventListeners();
    }

    renderStep1() {
        return `<div class="photo-capture"><h3>📷 Foto frontal</h3><p>Toma una foto clara del vehículo desde el frente</p><input type="file" id="vehiclePhoto" accept="image/*" capture="environment" style="display:none"><button class="btn btn-primary btn-large" onclick="document.getElementById('vehiclePhoto').click()">📸 Capturar Foto</button><div id="photoPreview"></div><button id="nextStep1" class="btn btn-success btn-full" style="margin-top: 1rem;">Siguiente →</button></div>`;
    }

    renderStep2() {
        const data = this.getStaticData();
        return `<div><h3>📄 Ficha técnica</h3><p style="margin-bottom: 1rem; color: #757575;">Captura la ficha técnica para extracción automática</p><input type="file" id="technicalSheet" accept="image/*" capture="environment" style="display:none"><button class="btn btn-primary btn-large" onclick="document.getElementById('technicalSheet').click()" style="width: 100%; margin-bottom: 1rem;">📸 Capturar Ficha Técnica</button><div id="sheetPreview"></div><div id="ocrLoading" class="loading hidden"><div class="spinner"></div><p>Procesando imagen con OCR...</p></div><div id="ocrResult" class="hidden"><div class="ocr-warning"><strong>⚠️ ATENCIÓN:</strong> Los datos mostrados son <strong>simulados con fines demostrativos</strong>. Por favor, verifica y corrige toda la información manualmente.</div><h4>Datos Extraídos:</h4><div class="form-group"><label class="form-label">Marca</label><select class="form-control" id="inputMarca"><option value="">Selecciona marca</option>${data.marcas.map(m => `<option value="${m}">${m}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Modelo</label><input type="text" class="form-control" id="inputModelo" placeholder="Ej: Golf"></div><div class="form-group"><label class="form-label">VIN</label><input type="text" class="form-control" id="inputVin" maxlength="17"></div><div class="form-group"><label class="form-label">Matrícula</label><input type="text" class="form-control" id="inputMatricula"></div><div class="form-group"><label class="form-label">Año</label><input type="number" class="form-control" id="inputYear" min="1990" max="2030"></div><div class="form-group"><label class="form-label">Código Motor</label><input type="text" class="form-control" id="codigoMotor"></div><div class="form-group"><label class="form-label">Kilometraje</label><input type="number" class="form-control" id="kilometraje"></div><div class="form-group"><label class="form-label">Motivo</label><select class="form-control" id="motivoIntervencion"><option value="">Selecciona motivo</option>${data.motivosIntervencion.map(m => `<option value="${m}">${m}</option>`).join('')}</select></div><button id="nextStep2" class="btn btn-success btn-full">Siguiente →</button></div></div>`;
    }

    renderStep3() {
        const data = this.getStaticData();
        const selectedTecnico = this.calibrationData.tecnicoId || '';
        return `<div><h3>🔧 Equipo y Técnico</h3><div style="margin-bottom: 2rem;"><h4>Equipo de Diagnóstico</h4><div class="form-group"><label class="form-label">Equipo</label><select class="form-control" id="equipoDiagnostico"><option value="">Selecciona equipo</option>${data.equipos.map(e => `<option value="${e.id}">${e.fabricante} - ${e.modelo}</option>`).join('')}</select></div></div><div class="card" style="background: #e3f2fd; padding: 1.5rem;"><h4 style="margin-bottom: 1rem;">👤 Técnico Responsable</h4><div class="form-group" style="margin-bottom: 0;"><label class="form-label">Técnico</label><select class="form-control" id="selectTecnico"><option value="">Selecciona técnico</option>${data.usuarios.map(u => `<option value="${u.id}" ${u.id === selectedTecnico ? 'selected' : ''}>${u.nombre}</option>`).join('')}</select></div></div><button id="nextStep3" class="btn btn-success btn-full" style="margin-top: 1.5rem;">Calibrar →</button></div>`;
    }

    renderStep4() {
        const data = this.getStaticData();
        const taller = this.calibrationData.taller ? data.talleres.find(t => t.id === this.calibrationData.taller) : null;
        return `<div><h3>⚙️ Calibración</h3><div class="card" style="background: #f9f9f9; margin-bottom: 2rem;"><h4>Resumen</h4><p><strong>Técnico:</strong> ${this.calibrationData.tecnico || 'N/A'}</p><p><strong>Vehículo:</strong> ${this.calibrationData.marca || 'N/A'} ${this.calibrationData.modelo || 'N/A'}</p><p><strong>Matrícula:</strong> ${this.calibrationData.matricula || 'N/A'}</p><p><strong>Equipo:</strong> ${this.calibrationData.equipo || 'N/A'}</p></div><div style="display: flex; gap: 1rem;"><button class="btn btn-success" onclick="app.finishCalibration(true)" style="flex: 1;">✅ OK</button><button class="btn btn-error" onclick="app.finishCalibration(false)" style="flex: 1;">❌ Problemas</button></div><div id="problemSection" class="hidden" style="margin-top: 2rem; padding: 1rem; background: #fff3e0; border-radius: 4px;"><h4>Problema</h4><textarea class="form-control" id="problema" rows="2"></textarea><button class="btn btn-success btn-full" style="margin-top: 1rem;" onclick="app.saveCalibration(false)">Guardar</button></div><div id="pdfSection" class="hidden" style="margin-top: 2rem; padding: 1.5rem; background: #e8f5e9; border-radius: 4px;"><h4 style="color: #2e7d32;">✅ Calibración Exitosa</h4><button class="btn btn-primary btn-full" onclick="app.downloadPDF()">📄 Descargar PDF</button></div></div>`;
    }

    attachWizardEventListeners() {
        const vehiclePhoto = document.getElementById('vehiclePhoto');
        if (vehiclePhoto) vehiclePhoto.addEventListener('change', e => this.handleVehiclePhoto(e));

        const technicalSheet = document.getElementById('technicalSheet');
        if (technicalSheet) technicalSheet.addEventListener('change', e => this.handleTechnicalSheet(e));

        ['nextStep1', 'nextStep2', 'nextStep3'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.nextStep());
        });
    }

    handleVehiclePhoto(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            this.calibrationData.vehiclePhoto = event.target.result;
            document.getElementById('photoPreview').innerHTML = `<img src="${event.target.result}" class="photo-preview" alt="Vehículo">`;
        };
        reader.readAsDataURL(file);
    }

    handleTechnicalSheet(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            this.calibrationData.technicalSheetPhoto = event.target.result;
            document.getElementById('sheetPreview').innerHTML = `<img src="${event.target.result}" class="photo-preview" alt="Ficha">`;
            document.getElementById('ocrLoading').classList.remove('hidden');
            setTimeout(() => {
                this.simulateOCR();
                document.getElementById('ocrLoading').classList.add('hidden');
                document.getElementById('ocrResult').classList.remove('hidden');
            }, 2500);
        };
        reader.readAsDataURL(file);
    }

    simulateOCR() {
        const marcasAleatorias = ['Volkswagen', 'Audi', 'Mercedes-Benz', 'BMW', 'Seat'];
        const modelosAleatorios = ['Golf', 'Polo', 'A3', 'A4', 'Clase C', 'Serie 3', 'León', 'Ibiza'];
        const letras = 'ABCDEFGHJKLMNPRSTUVWXYZ';
        const numeros = '0123456789';
        
        let vin = '';
        for (let i = 0; i < 17; i++) {
            vin += (i < 10) ? letras[Math.floor(Math.random() * letras.length)] : numeros[Math.floor(Math.random() * numeros.length)];
        }
        
        const matricula = Math.floor(1000 + Math.random() * 9000) + 
            letras[Math.floor(Math.random() * letras.length)] +
            letras[Math.floor(Math.random() * letras.length)] +
            letras[Math.floor(Math.random() * letras.length)];
        
        const marca = marcasAleatorias[Math.floor(Math.random() * marcasAleatorias.length)];
        const modelo = modelosAleatorios[Math.floor(Math.random() * modelosAleatorios.length)];
        const year = 2018 + Math.floor(Math.random() * 7);
        
        document.getElementById('inputMarca').value = marca;
        document.getElementById('inputModelo').value = modelo;
        document.getElementById('inputVin').value = vin;
        document.getElementById('inputMatricula').value = matricula;
        document.getElementById('inputYear').value = year;
        document.getElementById('codigoMotor').value = 'DLAA';
        document.getElementById('kilometraje').value = Math.floor(20000 + Math.random() * 100000);
    }

    nextStep() {
        const data = this.getStaticData();
        
        if (this.currentStep === 2) {
            this.calibrationData.marca = document.getElementById('inputMarca').value;
            this.calibrationData.modelo = document.getElementById('inputModelo').value;
            this.calibrationData.vin = document.getElementById('inputVin').value;
            this.calibrationData.matricula = document.getElementById('inputMatricula').value;
            this.calibrationData.year = document.getElementById('inputYear').value;
            this.calibrationData.codigoMotor = document.getElementById('codigoMotor').value;
            this.calibrationData.kilometraje = document.getElementById('kilometraje').value;
            this.calibrationData.motivo = document.getElementById('motivoIntervencion').value;
        } else if (this.currentStep === 3) {
            const equipoId = document.getElementById('equipoDiagnostico').value;
            if (equipoId) {
                const equipo = data.equipos.find(e => e.id === equipoId);
                this.calibrationData.equipo = equipo ? `${equipo.fabricante} - ${equipo.modelo}` : 'N/A';
            }
            
            const tecnicoId = document.getElementById('selectTecnico').value;
            if (tecnicoId) {
                const tecnico = data.usuarios.find(u => u.id === tecnicoId);
                if (tecnico) {
                    this.calibrationData.tecnico = tecnico.nombre;
                    this.calibrationData.tecnicoId = tecnico.id;
                    this.calibrationData.taller = tecnico.taller;
                    this.currentUser = tecnico;
                }
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
        if (isOk) {
            this.calibrationData.estado = 'completada';
            this.calibrationData.resultado = 'OK';
            this.calibrationData.fechaFin = new Date().toISOString();
            this.saveCalibrationFinal();
            document.getElementById('pdfSection').classList.remove('hidden');
        } else {
            document.getElementById('problemSection').classList.remove('hidden');
        }
    }

    saveCalibration(isResolved) {
        this.calibrationData.fechaFin = new Date().toISOString();
        this.calibrationData.estado = 'pendiente';
        this.calibrationData.resultado = 'Pendiente';
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
        alert('✅ Calibración guardada');
    }

    downloadPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const data = this.getStaticData();
        const taller = this.calibrationData.taller ? data.talleres.find(t => t.id === this.calibrationData.taller) : null;

        doc.setFontSize(18);
        doc.setTextColor(33, 150, 243);
        doc.text('INFORME DE CALIBRACIÓN ADAS', 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setTextColor(117, 117, 117);
        doc.text('GlassDrive', 105, 28, { align: 'center' });
        
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 35, 190, 35);
        
        let y = 45;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        doc.text(`Técnico: ${this.calibrationData.tecnico || 'N/A'}`, 20, y); y += 6;
        doc.text(`Vehículo: ${this.calibrationData.marca} ${this.calibrationData.modelo}`, 20, y); y += 6;
        doc.text(`Matrícula: ${this.calibrationData.matricula}`, 20, y); y += 6;
        doc.text(`VIN: ${this.calibrationData.vin}`, 20, y); y += 6;
        doc.text(`Año: ${this.calibrationData.year}`, 20, y); y += 6;
        doc.text(`Equipo: ${this.calibrationData.equipo}`, 20, y); y += 6;
        doc.text(`Fecha: ${new Date(this.calibrationData.fecha).toLocaleString('es-ES')}`, 20, y); y += 10;
        
        doc.setTextColor(46, 125, 50);
        doc.text(`RESULTADO: ${this.calibrationData.resultado}`, 20, y);
        
        doc.save(`Calibracion_${this.calibrationData.matricula}.pdf`);
    }

    populateSearchFilters() {
        const marcas = [...new Set(this.calibrations.map(c => c.marca).filter(m => m))];
        const filterMarca = document.getElementById('filterMarca');
        if (filterMarca) {
            filterMarca.innerHTML = '<option value="">Todas</option>';
            marcas.forEach(m => filterMarca.innerHTML += `<option value="${m}">${m}</option>`);
        }
    }

    renderSearchResults(filtered = null) {
        const results = filtered || this.calibrations;
        const container = document.getElementById('searchResults');
        if (!container) return;
        if (results.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 2rem;">Sin resultados</p>';
            return;
        }
        container.innerHTML = results.slice().reverse().map(cal => `
            <div class="result-card">
                <div class="result-info">
                    <h4>${cal.marca} ${cal.modelo}</h4>
                    <p><strong>Matrícula:</strong> ${cal.matricula}</p>
                    <p><strong>Técnico:</strong> ${cal.tecnico}</p>
                    <p><strong>Fecha:</strong> ${new Date(cal.fecha).toLocaleDateString('es-ES')}</p>
                </div>
            </div>
        `).join('');
    }

    applyFilters() {
        this.renderSearchResults();
    }

    clearFilters() {
        this.renderSearchResults();
    }

    renderHistory() {
        const container = document.getElementById('historyContent');
        if (!container) return;
        const total = this.calibrations.length;
        const completadas = this.calibrations.filter(c => c.estado === 'completada').length;
        container.innerHTML = `
            <div class="dashboard">
                <div class="card"><div class="card-icon">📊</div><div class="card-title">${total}</div></div>
                <div class="card"><div class="card-icon">✅</div><div class="card-title">${completadas}</div></div>
            </div>
        `;
    }

    saveData() {
        try {
            localStorage.setItem('calibrations', JSON.stringify(this.calibrations));
        } catch (error) {
            console.error('Error:', error);
        }
    }

    loadData() {
        try {
            const saved = localStorage.getItem('calibrations');
            if (saved) this.calibrations = JSON.parse(saved);
        } catch (error) {
            this.calibrations = [];
        }
    }
}

const app = new CalibrationSystem();