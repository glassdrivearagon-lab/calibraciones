// Sistema Profesional de Calibraciones ADAS
class AdasCalibrationSystem {
    constructor() {
        this.currentUser = null;
        this.currentTaller = null;
        this.currentEquipo = null;
        this.currentCalibration = null;
        this.selectedVehicle = null;
        this.calibrationData = {};
        this.measurements = {};
        this.calibrations = [];
        this.currentStep = 1;
        
        // Cargar datos de la aplicación
        this.loadApplicationData();
        
        // Cargar calibraciones guardadas
        this.loadSavedCalibrations();
        
        this.init();
    }

    loadApplicationData() {
        this.vehicles = [
            {
                id: "V001",
                matricula: "2429MJR",
                marca: "Volkswagen", 
                modelo: "Taigo",
                version: "1.0i 12V TSI",
                año: "2022",
                combustible: "Gasolina",
                potencia: "110 CV",
                codigo_motor: "DLAA",
                vin: "WVGZZZCSZPY088518",
                sistemas_adas: ["ACC", "LDW", "AEB", "Cámara frontal"],
                sensores: ["Radar frontal", "Cámara frontal multifunción"],
                ultima_calibracion: "2025-08-29",
                estado: "Calibrado"
            },
            {
                id: "V002", 
                matricula: "1157NBB",
                marca: "Volkswagen",
                modelo: "Golf VII",
                version: "2.0i 16v GTI",
                año: "2019",
                combustible: "Gasolina", 
                potencia: "230 CV",
                codigo_motor: "CHHA",
                vin: "WVWZZZAUZJW284754",
                sistemas_adas: ["ACC", "LDW", "AVM", "Cámara multifunción"],
                sensores: ["Radar frontal", "Cámara frontal", "Cámaras perimetrales"],
                ultima_calibracion: "2025-09-01",
                estado: "Calibrado"
            },
            {
                id: "V003",
                matricula: "5678ABC",
                marca: "Mercedes-Benz",
                modelo: "Clase C", 
                version: "C200d",
                año: "2021",
                combustible: "Diesel",
                potencia: "200 CV",
                codigo_motor: "OM654",
                vin: "WDD2058821A123456", 
                sistemas_adas: ["ACC", "LDW", "BSD", "AEB", "LiDAR"],
                sensores: ["Radar frontal", "Cámara frontal", "Sensores laterales", "Escáner láser"],
                ultima_calibracion: "2025-03-10",
                estado: "Pendiente"
            }
        ];

        this.talleres = [
            {
                id: "T001",
                nombre: "Lunia Zaragoza SL",
                direccion: "Antonio Sangenis 48",
                ciudad: "Zaragoza",
                codigo_postal: "50010",
                telefono: "976409360",
                email: "zaragoza.sangenis@glassdrive.es",
                especialidades: ["ADAS", "Sustitución parabrisas", "Calibración cámaras"]
            },
            {
                id: "T002", 
                nombre: "Lunia Zaragoza Plaza",
                direccion: "C/Batalla de Lepanto, 24",
                ciudad: "Zaragoza",
                codigo_postal: "50002",
                telefono: "607752465",
                email: "zaragoza.plaza@glassdrive.es",
                especialidades: ["ADAS", "Carrocería", "Pintura"]
            }
        ];

        this.usuarios = [
            {
                id: "U001",
                nombre: "Carlos Rodríguez",
                rol: "Técnico Senior",
                taller: "T001",
                especialidades: ["ADAS", "Diagnóstico", "Calibración cámaras"]
            },
            {
                id: "U002",
                nombre: "Israel García", 
                rol: "Técnico",
                taller: "T002",
                especialidades: ["Calibración", "Sustitución parabrisas"]
            }
        ];

        this.equipos_diagnostico = [
            {
                id: "E001",
                fabricante: "Hella Gutmann Solutions",
                modelo: "mega macs 42 SE",
                numero_serie: "HG001234",
                version_software: "2025.7",
                taller: "T001"
            },
            {
                id: "E002",
                fabricante: "TEXA",
                modelo: "AXONE S",
                numero_serie: "DNRJT013235", 
                version_software: "CA1JT002040",
                taller: "T002"
            }
        ];

        this.tipos_calibracion = [
            {
                codigo: "CAM_DIN",
                nombre: "Calibración dinámica del sistema de cámara frontal",
                descripcion: "Calibración dinámica de cámara multifunción",
                tiempo_estimado: 15,
                coste_base: 85.00,
                mediciones: ["angulo_guiñada", "angulo_inclinacion", "angulo_balanceo"],
                tolerancias: {
                    angulo_guiñada: {min: -2.85, max: 2.85, unidad: "°"},
                    angulo_inclinacion: {min: -2.85, max: 2.85, unidad: "°"},
                    angulo_balanceo: {min: -2.85, max: 2.85, unidad: "°"}
                }
            },
            {
                codigo: "CAM_EST", 
                nombre: "Calibración estática de cámara frontal",
                descripcion: "Calibración con dianas estáticas",
                tiempo_estimado: 30,
                coste_base: 120.00,
                mediciones: ["altura_montaje", "angulo_cabeceo", "angulo_derrapaje"],
                tolerancias: {
                    altura_montaje: {min: 1250, max: 1350, unidad: "mm"},
                    angulo_cabeceo: {min: -2.85, max: 2.85, unidad: "°"},
                    angulo_derrapaje: {min: -2.85, max: 2.85, unidad: "°"}
                }
            },
            {
                codigo: "RADAR_ACC",
                nombre: "Calibración radar ACC",
                descripcion: "Control de Crucero Adaptativo",
                tiempo_estimado: 45,
                coste_base: 150.00,
                mediciones: ["alcance_radar", "angulo_azimut"],
                tolerancias: {
                    alcance_radar: {min: 150, max: 200, unidad: "m"},
                    angulo_azimut: {min: -10, max: 10, unidad: "°"}
                }
            }
        ];

        this.motivos_intervencion = [
            "Sustitución del parabrisas",
            "Reparación tras accidente", 
            "Calibración periódica",
            "Fallo en sistema ADAS",
            "Cambio de centralita",
            "Actualización de software",
            "Verificación post-reparación"
        ];
    }

    loadSavedCalibrations() {
        // Inicializamos con datos de ejemplo
        this.calibrations = [
            {
                id: "C001",
                fecha_inicio: new Date("2025-09-01T09:00:00"),
                vehiculo: this.vehicles[0],
                usuario: this.usuarios[0],
                taller: this.talleres[0],
                equipo: this.equipos_diagnostico[0],
                tipo_calibracion: this.tipos_calibracion[0],
                motivo: "Sustitución del parabrisas",
                estado: "Completado - OK",
                tiempo_real: 18,
                coste_final: 85.00,
                measurements: {
                    angulo_guiñada: { valor: 1.2, status: "ok" },
                    angulo_inclinacion: { valor: -0.8, status: "ok" },
                    angulo_balanceo: { valor: 0.5, status: "ok" }
                }
            }
        ];
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('DOM loaded, setting up...');
                this.setup();
            });
        } else {
            console.log('DOM ready, setting up immediately...');
            this.setup();
        }
    }

    setup() {
        console.log('🚀 Inicializando Sistema ADAS...');
        
        // Wait a moment to ensure all elements are ready
        setTimeout(() => {
            this.populateSelects();
            this.setupEventListeners();
            this.showLoginModal();
            console.log('✅ Sistema ADAS inicializado correctamente');
        }, 100);
    }

    populateSelects() {
        console.log('Poblando selects...');
        
        // Usuarios
        const userSelect = document.getElementById('userSelect');
        if (userSelect) {
            userSelect.innerHTML = '<option value="">Selecciona un usuario</option>';
            this.usuarios.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario.id;
                option.textContent = `${usuario.nombre} - ${usuario.rol}`;
                userSelect.appendChild(option);
            });
            console.log('✅ Usuarios poblados:', this.usuarios.length);
        } else {
            console.error('❌ No se encontró userSelect');
        }

        // Talleres
        const tallerSelect = document.getElementById('tallerSelect');
        if (tallerSelect) {
            tallerSelect.innerHTML = '<option value="">Selecciona un taller</option>';
            this.talleres.forEach(taller => {
                const option = document.createElement('option');
                option.value = taller.id;
                option.textContent = `${taller.nombre} - ${taller.ciudad}`;
                tallerSelect.appendChild(option);
            });
            console.log('✅ Talleres poblados:', this.talleres.length);
        } else {
            console.error('❌ No se encontró tallerSelect');
        }

        // Equipos (initially empty, will be populated when taller is selected)
        const equipoSelect = document.getElementById('equipoSelect');
        if (equipoSelect) {
            equipoSelect.innerHTML = '<option value="">Selecciona un equipo</option>';
            console.log('✅ Equipo select inicializado');
        } else {
            console.error('❌ No se encontró equipoSelect');
        }

        // Motivos de intervención
        const motivoSelect = document.getElementById('motivoIntervencion');
        if (motivoSelect) {
            motivoSelect.innerHTML = '<option value="">Seleccionar motivo</option>';
            this.motivos_intervencion.forEach(motivo => {
                const option = document.createElement('option');
                option.value = motivo;
                option.textContent = motivo;
                motivoSelect.appendChild(option);
            });
            console.log('✅ Motivos poblados:', this.motivos_intervencion.length);
        }

        // Tipos de calibración
        const tipoSelect = document.getElementById('tipoCalibracion');
        if (tipoSelect) {
            tipoSelect.innerHTML = '<option value="">Seleccionar tipo</option>';
            this.tipos_calibracion.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.codigo;
                option.textContent = `${tipo.nombre} (${tipo.tiempo_estimado} min - €${tipo.coste_base})`;
                tipoSelect.appendChild(option);
            });
            console.log('✅ Tipos de calibración poblados:', this.tipos_calibracion.length);
        }

        // Filtros
        this.populateFilters();
    }

    populateFilters() {
        const filterTaller = document.getElementById('filterTaller');
        if (filterTaller) {
            filterTaller.innerHTML = '<option value="">Todos los talleres</option>';
            this.talleres.forEach(taller => {
                const option = document.createElement('option');
                option.value = taller.id;
                option.textContent = taller.nombre;
                filterTaller.appendChild(option);
            });
        }

        const filterTecnico = document.getElementById('filterTecnico');
        if (filterTecnico) {
            filterTecnico.innerHTML = '<option value="">Todos los técnicos</option>';
            this.usuarios.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario.id;
                option.textContent = usuario.nombre;
                filterTecnico.appendChild(option);
            });
        }

        // Calibraciones para informes
        const reportSelect = document.getElementById('selectCalibrationForReport');
        if (reportSelect) {
            this.updateReportSelect();
        }
    }

    updateReportSelect() {
        const reportSelect = document.getElementById('selectCalibrationForReport');
        if (reportSelect) {
            reportSelect.innerHTML = '<option value="">Seleccionar calibración...</option>';
            this.calibrations.forEach(cal => {
                const option = document.createElement('option');
                option.value = cal.id;
                option.textContent = `${cal.vehiculo.marca} ${cal.vehiculo.modelo} - ${new Date(cal.fecha_inicio).toLocaleDateString('es-ES')} - ${cal.estado}`;
                reportSelect.appendChild(option);
            });
        }
    }

    setupEventListeners() {
        console.log('Configurando event listeners...');
        
        // Login form - usando evento más robusto
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            console.log('✅ Login form encontrado');
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('📝 Login form submitted');
                this.handleLogin();
            });
            
            // También agregar listener al botón directamente
            const loginButton = loginForm.querySelector('button[type="submit"]');
            if (loginButton) {
                loginButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('🖱️ Login button clicked');
                    this.handleLogin();
                });
            }
        } else {
            console.error('❌ No se encontró loginForm');
        }

        // Taller selection updates equipment
        const tallerSelect = document.getElementById('tallerSelect');
        if (tallerSelect) {
            tallerSelect.addEventListener('change', (e) => {
                console.log('🏢 Taller changed:', e.target.value);
                this.updateEquipmentSelect();
            });
        }

        // Navigation
        document.querySelectorAll('.nav-btn[data-section]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                console.log('🧭 Navigation clicked:', section);
                this.showSection(section);
            });
        });

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🚪 Logout clicked');
                this.handleLogout();
            });
        }

        // Vehicle search and management
        this.setupVehicleEventListeners();

        // Wizard navigation
        this.setupWizardEventListeners();

        // Calibration flow
        this.setupCalibrationEventListeners();

        // Filters and reports
        this.setupFiltersEventListeners();
        
        console.log('✅ Event listeners configurados');
    }

    setupVehicleEventListeners() {
        const vehicleSearchForm = document.getElementById('vehicleSearchForm');
        if (vehicleSearchForm) {
            vehicleSearchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('🔍 Vehicle search submitted');
                this.searchVehicle();
            });
        }

        const newVehicleBtn = document.getElementById('newVehicleBtn');
        if (newVehicleBtn) {
            newVehicleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('➕ New vehicle clicked');
                this.showNewVehicleForm();
            });
        }

        const createVehicleForm = document.getElementById('createVehicleForm');
        if (createVehicleForm) {
            createVehicleForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('✅ Create vehicle submitted');
                this.createNewVehicle();
            });
        }

        const cancelNewVehicle = document.getElementById('cancelNewVehicle');
        if (cancelNewVehicle) {
            cancelNewVehicle.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('❌ Cancel new vehicle');
                this.hideNewVehicleForm();
            });
        }

        const backToSearchBtn = document.getElementById('backToSearchBtn');
        if (backToSearchBtn) {
            backToSearchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('◀️ Back to search');
                this.backToSearch();
            });
        }
    }

    setupWizardEventListeners() {
        const continueToCalibrationBtn = document.getElementById('continueToCalibrationBtn');
        if (continueToCalibrationBtn) {
            continueToCalibrationBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('▶️ Continue to calibration');
                this.showStep(2);
            });
        }

        const calibrationConfigForm = document.getElementById('calibrationConfigForm');
        if (calibrationConfigForm) {
            calibrationConfigForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('⚙️ Calibration config submitted');
                this.processCalibrationConfig();
            });
        }

        const measurementsForm = document.getElementById('measurementsForm');
        if (measurementsForm) {
            measurementsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('📐 Measurements submitted');
                this.processMeasurements();
            });
        }

        // Back buttons
        const backToVehicleBtn = document.getElementById('backToVehicleBtn');
        if (backToVehicleBtn) {
            backToVehicleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showStep(1);
            });
        }

        const backToConfigBtn = document.getElementById('backToConfigBtn');
        if (backToConfigBtn) {
            backToConfigBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showStep(2);
            });
        }

        const backToMeasurementsBtn = document.getElementById('backToMeasurementsBtn');
        if (backToMeasurementsBtn) {
            backToMeasurementsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showStep(3);
            });
        }
    }

    setupCalibrationEventListeners() {
        const finishSuccessBtn = document.getElementById('finishSuccessBtn');
        if (finishSuccessBtn) {
            finishSuccessBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showFinishModal(true);
            });
        }

        const finishErrorBtn = document.getElementById('finishErrorBtn');
        if (finishErrorBtn) {
            finishErrorBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showFinishModal(false);
            });
        }

        const finishForm = document.getElementById('finishForm');
        if (finishForm) {
            finishForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.finishCalibration();
            });
        }

        const cancelFinish = document.getElementById('cancelFinish');
        if (cancelFinish) {
            cancelFinish.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideFinishModal();
            });
        }
    }

    setupFiltersEventListeners() {
        const applyFiltersBtn = document.getElementById('applyFiltersBtn');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.applyFilters();
            });
        }

        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearFilters();
            });
        }

        // Report generation
        const selectCalibrationForReport = document.getElementById('selectCalibrationForReport');
        if (selectCalibrationForReport) {
            selectCalibrationForReport.addEventListener('change', () => this.updateReportButtons());
        }

        const generateReportBtn = document.getElementById('generateReportBtn');
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.generateReport();
            });
        }

        const previewReportBtn = document.getElementById('previewReportBtn');
        if (previewReportBtn) {
            previewReportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previewReport();
            });
        }

        const closeReportModal = document.getElementById('closeReportModal');
        if (closeReportModal) {
            closeReportModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeReportModal();
            });
        }

        const downloadReportBtn = document.getElementById('downloadReportBtn');
        if (downloadReportBtn) {
            downloadReportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadReport();
            });
        }

        const printReportBtn = document.getElementById('printReportBtn');
        if (printReportBtn) {
            printReportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.printReport();
            });
        }
    }

    updateEquipmentSelect() {
        const tallerSelect = document.getElementById('tallerSelect');
        const equipoSelect = document.getElementById('equipoSelect');
        
        if (!tallerSelect || !equipoSelect) return;
        
        const selectedTaller = tallerSelect.value;
        console.log('🔧 Updating equipment for taller:', selectedTaller);
        
        equipoSelect.innerHTML = '<option value="">Selecciona un equipo</option>';
        
        if (selectedTaller) {
            const equipos = this.equipos_diagnostico.filter(equipo => equipo.taller === selectedTaller);
            console.log('📋 Found equipment:', equipos.length);
            equipos.forEach(equipo => {
                const option = document.createElement('option');
                option.value = equipo.id;
                option.textContent = `${equipo.fabricante} ${equipo.modelo} (${equipo.numero_serie})`;
                equipoSelect.appendChild(option);
            });
        }
    }

    showLoginModal() {
        console.log('🔐 Showing login modal');
        const loginModal = document.getElementById('loginModal');
        const mainNav = document.getElementById('mainNav');
        
        if (loginModal) {
            loginModal.classList.remove('hidden');
            console.log('✅ Login modal shown');
        } else {
            console.error('❌ Login modal not found');
        }
        
        if (mainNav) {
            mainNav.style.display = 'none';
            console.log('✅ Main nav hidden');
        }
    }

    hideLoginModal() {
        console.log('🔐 Hiding login modal');
        const loginModal = document.getElementById('loginModal');
        const mainNav = document.getElementById('mainNav');
        
        if (loginModal) {
            loginModal.classList.add('hidden');
            console.log('✅ Login modal hidden');
        }
        
        if (mainNav) {
            mainNav.style.display = 'block';
            console.log('✅ Main nav shown');
        }
    }

    handleLogin() {
        console.log('🚀 Handling login...');
        
        const userSelect = document.getElementById('userSelect');
        const tallerSelect = document.getElementById('tallerSelect');
        const equipoSelect = document.getElementById('equipoSelect');
        
        if (!userSelect || !tallerSelect || !equipoSelect) {
            console.error('❌ Missing login form elements');
            alert('❌ Error: Elementos del formulario no encontrados');
            return;
        }
        
        const userId = userSelect.value;
        const tallerId = tallerSelect.value;
        const equipoId = equipoSelect.value;

        console.log('📋 Login values:', {userId, tallerId, equipoId});

        if (!userId || !tallerId || !equipoId) {
            alert('⚠️ Por favor, selecciona usuario, taller y equipo de diagnóstico');
            return;
        }

        this.currentUser = this.usuarios.find(u => u.id === userId);
        this.currentTaller = this.talleres.find(t => t.id === tallerId);
        this.currentEquipo = this.equipos_diagnostico.find(e => e.id === equipoId);

        console.log('👤 Login successful:', {
            user: this.currentUser?.nombre,
            taller: this.currentTaller?.nombre,
            equipo: this.currentEquipo?.modelo
        });

        const currentUserElement = document.getElementById('currentUser');
        const currentEquipment = document.getElementById('currentEquipment');
        
        if (currentUserElement) {
            currentUserElement.textContent = `👤 ${this.currentUser.nombre} - ${this.currentTaller.nombre}`;
        }
        
        if (currentEquipment) {
            currentEquipment.textContent = `🔧 ${this.currentEquipo.fabricante} ${this.currentEquipo.modelo}`;
        }

        this.hideLoginModal();
        this.showSection('registrar');
        
        console.log('✅ Login completed successfully');
    }

    handleLogout() {
        console.log('🚪 Handling logout...');
        
        this.currentUser = null;
        this.currentTaller = null;
        this.currentEquipo = null;
        this.currentCalibration = null;
        this.selectedVehicle = null;
        this.calibrationData = {};
        this.measurements = {};
        this.currentStep = 1;
        
        this.resetForms();
        this.showLoginModal();
        
        console.log('✅ Logout completed');
    }

    resetForms() {
        document.querySelectorAll('form').forEach(form => form.reset());
        document.querySelectorAll('.wizard-step').forEach(step => step.classList.add('hidden'));
        const step1 = document.getElementById('step1');
        if (step1) step1.classList.remove('hidden');
        
        const currentUserElement = document.getElementById('currentUser');
        const currentEquipment = document.getElementById('currentEquipment');
        
        if (currentUserElement) currentUserElement.textContent = 'Iniciar Sesión';
        if (currentEquipment) currentEquipment.textContent = '';
    }

    showSection(sectionName) {
        console.log('🧭 Showing section:', sectionName);
        
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Update navigation
        document.querySelectorAll('.nav-btn[data-section]').forEach(btn => {
            btn.classList.remove('active', 'btn--primary');
            btn.classList.add('btn--outline');
        });

        const activeBtn = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active', 'btn--primary');
            activeBtn.classList.remove('btn--outline');
        }

        // Show target section
        const targetSection = document.getElementById(`${sectionName}Section`);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log('✅ Section shown:', sectionName);
        } else {
            console.error('❌ Section not found:', sectionName);
        }

        // Load section-specific data
        switch (sectionName) {
            case 'consultar':
                this.loadCalibrationsList();
                break;
            case 'historico':
                this.loadStatistics();
                break;
            case 'informes':
                this.updateReportSelect();
                break;
        }

        // Reset wizard if going to registrar
        if (sectionName === 'registrar') {
            this.currentStep = 1;
            this.showStep(1);
        }
    }

    showStep(step) {
        console.log('📝 Showing step:', step);
        
        document.querySelectorAll('.wizard-step').forEach(stepElement => {
            stepElement.classList.add('hidden');
        });

        if (step === 1) {
            const step1 = document.getElementById('step1');
            if (step1) step1.classList.remove('hidden');
        } else if (step === 2) {
            const step2 = document.getElementById('step2');
            if (step2) step2.classList.remove('hidden');
        } else if (step === 3) {
            const step3 = document.getElementById('step3');
            if (step3) step3.classList.remove('hidden');
        } else if (step === 4) {
            const step4 = document.getElementById('step4');
            if (step4) step4.classList.remove('hidden');
        }

        this.currentStep = step;
        console.log('✅ Step shown:', step);
    }

    searchVehicle() {
        console.log('🔍 Searching vehicle...');
        
        const vin = document.getElementById('searchVin')?.value?.trim();
        const matricula = document.getElementById('searchMatricula')?.value?.trim();
        const marca = document.getElementById('searchMarca')?.value?.trim().toLowerCase();
        const modelo = document.getElementById('searchModelo')?.value?.trim().toLowerCase();

        console.log('🔍 Search criteria:', {vin, matricula, marca, modelo});

        if (!vin && !matricula && !marca && !modelo) {
            alert('⚠️ Introduce al menos un criterio de búsqueda');
            return;
        }

        const foundVehicle = this.vehicles.find(v => {
            const vinMatch = !vin || v.vin?.includes(vin.toUpperCase());
            const matriculaMatch = !matricula || v.matricula?.includes(matricula.toUpperCase());
            const marcaMatch = !marca || v.marca?.toLowerCase().includes(marca);
            const modeloMatch = !modelo || v.modelo?.toLowerCase().includes(modelo);
            return vinMatch && matriculaMatch && marcaMatch && modeloMatch;
        });

        if (foundVehicle) {
            console.log('✅ Vehicle found:', foundVehicle.marca, foundVehicle.modelo);
            this.showVehicleDetails(foundVehicle);
        } else {
            console.log('❌ Vehicle not found');
            if (confirm('🚗 Vehículo no encontrado. ¿Deseas crear uno nuevo?')) {
                this.showNewVehicleForm();
            }
        }
    }

    showVehicleDetails(vehicle) {
        console.log('🚗 Showing vehicle details for:', vehicle.marca, vehicle.modelo);
        
        const vehicleDetails = document.getElementById('vehicleDetails');
        const vehicleInfo = document.getElementById('vehicleInfo');
        
        if (!vehicleDetails || !vehicleInfo) {
            console.error('❌ Vehicle details elements not found');
            return;
        }

        vehicleInfo.innerHTML = `
            <div class="vehicle-info-grid">
                <div class="vehicle-detail">
                    <div class="vehicle-detail__label">🆔 VIN</div>
                    <div class="vehicle-detail__value">${vehicle.vin || 'N/A'}</div>
                </div>
                <div class="vehicle-detail">
                    <div class="vehicle-detail__label">🚙 Matrícula</div>
                    <div class="vehicle-detail__value">${vehicle.matricula}</div>
                </div>
                <div class="vehicle-detail">
                    <div class="vehicle-detail__label">🏭 Marca</div>
                    <div class="vehicle-detail__value">${vehicle.marca}</div>
                </div>
                <div class="vehicle-detail">
                    <div class="vehicle-detail__label">🚘 Modelo</div>
                    <div class="vehicle-detail__value">${vehicle.modelo}</div>
                </div>
                <div class="vehicle-detail">
                    <div class="vehicle-detail__label">⚙️ Versión</div>
                    <div class="vehicle-detail__value">${vehicle.version}</div>
                </div>
                <div class="vehicle-detail">
                    <div class="vehicle-detail__label">📅 Año</div>
                    <div class="vehicle-detail__value">${vehicle.año}</div>
                </div>
                <div class="vehicle-detail">
                    <div class="vehicle-detail__label">⛽ Combustible</div>
                    <div class="vehicle-detail__value">${vehicle.combustible}</div>
                </div>
                <div class="vehicle-detail">
                    <div class="vehicle-detail__label">💪 Potencia</div>
                    <div class="vehicle-detail__value">${vehicle.potencia}</div>
                </div>
                <div class="vehicle-detail">
                    <div class="vehicle-detail__label">🔧 Código Motor</div>
                    <div class="vehicle-detail__value">${vehicle.codigo_motor || 'N/A'}</div>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">🛡️ Sistemas ADAS</label>
                <div class="systems-list">
                    ${vehicle.sistemas_adas.map(sistema => 
                        `<span class="system-tag">${sistema}</span>`
                    ).join('')}
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">📡 Sensores</label>
                <div class="sensors-list">
                    ${vehicle.sensores.map(sensor => 
                        `<span class="sensor-tag">${sensor}</span>`
                    ).join('')}
                </div>
            </div>
        `;

        this.selectedVehicle = vehicle;
        document.getElementById('step1')?.classList.add('hidden');
        document.getElementById('newVehicleForm')?.classList.add('hidden');
        vehicleDetails.classList.remove('hidden');
        
        console.log('✅ Vehicle details shown');
    }

    showNewVehicleForm() {
        console.log('➕ Showing new vehicle form');
        
        const newVehicleForm = document.getElementById('newVehicleForm');
        
        document.getElementById('step1')?.classList.add('hidden');
        document.getElementById('vehicleDetails')?.classList.add('hidden');
        if (newVehicleForm) newVehicleForm.classList.remove('hidden');

        // Pre-fill with search data
        const searchData = {
            vin: document.getElementById('searchVin')?.value,
            matricula: document.getElementById('searchMatricula')?.value,
            marca: document.getElementById('searchMarca')?.value,
            modelo: document.getElementById('searchModelo')?.value
        };

        Object.entries(searchData).forEach(([key, value]) => {
            if (value) {
                const input = document.getElementById(`new${key.charAt(0).toUpperCase() + key.slice(1)}`);
                if (input) input.value = value;
            }
        });
        
        console.log('✅ New vehicle form shown');
    }

    hideNewVehicleForm() {
        const newVehicleForm = document.getElementById('newVehicleForm');
        if (newVehicleForm) newVehicleForm.classList.add('hidden');
        
        document.getElementById('createVehicleForm')?.reset();
        document.getElementById('step1')?.classList.remove('hidden');
    }

    backToSearch() {
        document.getElementById('vehicleDetails')?.classList.add('hidden');
        document.getElementById('step1')?.classList.remove('hidden');
        this.selectedVehicle = null;
    }

    createNewVehicle() {
        console.log('✅ Creating new vehicle...');
        
        const form = document.getElementById('createVehicleForm');
        if (!form) {
            console.error('❌ Create vehicle form not found');
            return;
        }
        
        const formData = new FormData(form);
        
        const newVehicle = {
            id: `V${String(this.vehicles.length + 1).padStart(3, '0')}`,
            vin: formData.get('newVin') || '',
            matricula: formData.get('newMatricula') || '',
            marca: formData.get('newMarca') || '',
            modelo: formData.get('newModelo') || '',
            version: formData.get('newVersion') || 'Base',
            año: formData.get('newAño') || '',
            combustible: formData.get('newCombustible') || 'Gasolina',
            potencia: formData.get('newPotencia') || 'N/A',
            codigo_motor: formData.get('newCodigoMotor') || '',
            sistemas_adas: ['ACC', 'LDW', 'AEB'],
            sensores: ['Radar frontal', 'Cámara frontal'],
            ultima_calibracion: null,
            estado: 'Nuevo'
        };

        this.vehicles.push(newVehicle);
        this.selectedVehicle = newVehicle;
        
        console.log('✅ New vehicle created:', newVehicle.marca, newVehicle.modelo);
        
        this.hideNewVehicleForm();
        this.showVehicleDetails(newVehicle);
        
        alert('✅ Vehículo creado exitosamente');
    }

    processCalibrationConfig() {
        console.log('⚙️ Processing calibration config...');
        
        const form = document.getElementById('calibrationConfigForm');
        if (!form) {
            console.error('❌ Calibration config form not found');
            return;
        }
        
        const formData = new FormData(form);
        
        this.calibrationData = {
            motivo: formData.get('motivoIntervencion'),
            tipo_codigo: formData.get('tipoCalibracion'),
            observaciones: formData.get('observacionesIniciales')
        };

        console.log('📋 Calibration data:', this.calibrationData);

        const tipoCalibracion = this.tipos_calibracion.find(t => t.codigo === this.calibrationData.tipo_codigo);
        if (tipoCalibracion) {
            this.calibrationData.tipo = tipoCalibracion;
            this.generateMeasurements(tipoCalibracion);
            this.showStep(3);
            console.log('✅ Calibration config processed');
        } else {
            console.error('❌ Calibration type not found');
            alert('⚠️ Error: Tipo de calibración no encontrado');
        }
    }

    generateMeasurements(tipoCalibracion) {
        const container = document.getElementById('measurementsContainer');
        if (!container) return;

        const mediciones = tipoCalibracion.mediciones;
        const tolerancias = tipoCalibracion.tolerancias;

        container.innerHTML = `
            <div class="measurements-grid">
                <div class="measurement-group">
                    <h4>📐 Mediciones de ${tipoCalibracion.nombre}</h4>
                    ${mediciones.map(medicion => {
                        const tolerancia = tolerancias[medicion];
                        return `
                            <div class="measurement-input">
                                <label class="form-label">${this.getMedicionLabel(medicion)}</label>
                                <input type="number" 
                                       class="form-control" 
                                       id="${medicion}" 
                                       step="0.01"
                                       placeholder="${tolerancia.min} - ${tolerancia.max}"
                                       data-min="${tolerancia.min}"
                                       data-max="${tolerancia.max}">
                                <span class="measurement-unit">${tolerancia.unidad}</span>
                                <span class="measurement-status measurement-status--pending" id="${medicion}_status">Pendiente</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        // Add real-time validation
        mediciones.forEach(medicion => {
            const input = document.getElementById(medicion);
            const status = document.getElementById(`${medicion}_status`);
            
            if (input && status) {
                input.addEventListener('input', () => this.validateMeasurement(medicion, input, status, tolerancias[medicion]));
            }
        });
    }

    getMedicionLabel(medicion) {
        const labels = {
            angulo_guiñada: '🔄 Ángulo de Guiñada',
            angulo_inclinacion: '📐 Ángulo de Inclinación',
            angulo_balanceo: '⚖️ Ángulo de Balanceo',
            altura_montaje: '📏 Altura de Montaje',
            angulo_cabeceo: '🔽 Ángulo de Cabeceo',
            angulo_derrapaje: '↩️ Ángulo de Derrapaje',
            alcance_radar: '📡 Alcance del Radar',
            angulo_azimut: '🧭 Ángulo de Azimut'
        };
        return labels[medicion] || medicion;
    }

    validateMeasurement(medicion, input, statusElement, tolerancia) {
        const valor = parseFloat(input.value);
        
        if (isNaN(valor)) {
            statusElement.textContent = 'Pendiente';
            statusElement.className = 'measurement-status measurement-status--pending';
            input.classList.remove('success', 'error');
            return;
        }

        const isValid = valor >= tolerancia.min && valor <= tolerancia.max;
        
        if (isValid) {
            statusElement.textContent = 'OK';
            statusElement.className = 'measurement-status measurement-status--ok';
            input.classList.add('success');
            input.classList.remove('error');
        } else {
            statusElement.textContent = 'Fuera de rango';
            statusElement.className = 'measurement-status measurement-status--error';
            input.classList.add('error');
            input.classList.remove('success');
        }

        // Store measurement
        if (!this.measurements) this.measurements = {};
        this.measurements[medicion] = {
            valor: valor,
            status: isValid ? 'ok' : 'error',
            tolerancia: tolerancia
        };
    }

    processMeasurements() {
        console.log('📐 Processing measurements...');
        
        // Validate all measurements are completed
        const tipoCalibracion = this.calibrationData.tipo;
        const allComplete = tipoCalibracion.mediciones.every(medicion => {
            const input = document.getElementById(medicion);
            return input && input.value !== '';
        });

        if (!allComplete) {
            alert('⚠️ Por favor, completa todas las mediciones antes de continuar');
            return;
        }

        this.generateCalibrationSummary();
        this.showStep(4);
        console.log('✅ Measurements processed');
    }

    generateCalibrationSummary() {
        const container = document.getElementById('calibrationSummary');
        if (!container) return;

        const tiempoEstimado = this.calibrationData.tipo.tiempo_estimado;
        const costeEstimado = this.calibrationData.tipo.coste_base;
        
        const measurementsOk = Object.values(this.measurements).filter(m => m.status === 'ok').length;
        const totalMeasurements = Object.values(this.measurements).length;
        const successRate = (measurementsOk / totalMeasurements) * 100;

        container.innerHTML = `
            <div class="calibration-summary">
                <h4>📋 Resumen de Calibración</h4>
                <div class="vehicle-info-grid">
                    <div class="vehicle-detail">
                        <div class="vehicle-detail__label">🚗 Vehículo</div>
                        <div class="vehicle-detail__value">${this.selectedVehicle.marca} ${this.selectedVehicle.modelo}</div>
                    </div>
                    <div class="vehicle-detail">
                        <div class="vehicle-detail__label">🔧 Tipo de Calibración</div>
                        <div class="vehicle-detail__value">${this.calibrationData.tipo.nombre}</div>
                    </div>
                    <div class="vehicle-detail">
                        <div class="vehicle-detail__label">📋 Motivo</div>
                        <div class="vehicle-detail__value">${this.calibrationData.motivo}</div>
                    </div>
                    <div class="vehicle-detail">
                        <div class="vehicle-detail__label">👤 Técnico</div>
                        <div class="vehicle-detail__value">${this.currentUser.nombre}</div>
                    </div>
                    <div class="vehicle-detail">
                        <div class="vehicle-detail__label">⏱️ Tiempo Estimado</div>
                        <div class="vehicle-detail__value">${tiempoEstimado} min</div>
                    </div>
                    <div class="vehicle-detail">
                        <div class="vehicle-detail__label">💰 Coste Estimado</div>
                        <div class="vehicle-detail__value">€${costeEstimado.toFixed(2)}</div>
                    </div>
                </div>
                
                <h5>📐 Resultados de Mediciones</h5>
                <div class="measurements-results">
                    ${Object.entries(this.measurements).map(([medicion, data]) => `
                        <div class="measurement-result ${data.status === 'ok' ? 'success' : 'error'}">
                            <span class="measurement-name">${this.getMedicionLabel(medicion)}</span>
                            <span class="measurement-value">${data.valor} ${data.tolerancia.unidad}</span>
                            <span class="measurement-status-icon">${data.status === 'ok' ? '✅' : '❌'}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="success-rate ${successRate === 100 ? 'success' : successRate >= 80 ? 'warning' : 'error'}">
                    <strong>📊 Tasa de Éxito: ${successRate.toFixed(1)}% (${measurementsOk}/${totalMeasurements})</strong>
                </div>
            </div>
        `;
    }

    showFinishModal(success) {
        const modal = document.getElementById('finishModal');
        const title = document.getElementById('finishModalTitle');
        const errorFields = document.getElementById('errorFields');

        if (title) {
            title.textContent = success ? '✅ Finalizar Calibración - ÉXITO' : '❌ Finalizar Calibración - ERROR';
        }
        
        if (errorFields) {
            if (success) {
                errorFields.classList.add('hidden');
                const errorDesc = document.getElementById('errorDescription');
                if (errorDesc) errorDesc.required = false;
            } else {
                errorFields.classList.remove('hidden');
                const errorDesc = document.getElementById('errorDescription');
                if (errorDesc) errorDesc.required = true;
            }
        }

        this.finishSuccess = success;
        if (modal) modal.classList.remove('hidden');
    }

    hideFinishModal() {
        const modal = document.getElementById('finishModal');
        const form = document.getElementById('finishForm');

        if (modal) modal.classList.add('hidden');
        if (form) form.reset();
    }

    finishCalibration() {
        console.log('🏁 Finishing calibration...');
        
        const now = new Date();
        const tiempoReal = Math.max(5, Math.round(Math.random() * 20) + this.calibrationData.tipo.tiempo_estimado - 5);

        const calibrationRecord = {
            id: `C${Date.now()}`,
            fecha_inicio: now,
            vehiculo: { ...this.selectedVehicle },
            usuario: { ...this.currentUser },
            taller: { ...this.currentTaller },
            equipo: { ...this.currentEquipo },
            tipo_calibracion: { ...this.calibrationData.tipo },
            motivo: this.calibrationData.motivo,
            observaciones_iniciales: this.calibrationData.observaciones,
            estado: this.finishSuccess ? 'Completado - OK' : 'Completado - ERROR',
            tiempo_real: tiempoReal,
            coste_final: this.calculateFinalCost(tiempoReal),
            measurements: { ...this.measurements },
            notas_finales: document.getElementById('finalNotes')?.value || ''
        };

        if (!this.finishSuccess) {
            calibrationRecord.error_descripcion = document.getElementById('errorDescription')?.value || '';
            calibrationRecord.solucion_aplicada = document.getElementById('solutionApplied')?.value || '';
        }

        this.calibrations.push(calibrationRecord);
        this.updateReportSelect();

        // Update vehicle status
        this.selectedVehicle.ultima_calibracion = now.toISOString().split('T')[0];
        this.selectedVehicle.estado = this.finishSuccess ? 'Calibrado' : 'Pendiente';

        console.log('✅ Calibration finished:', calibrationRecord.estado);

        this.hideFinishModal();
        this.showCalibrationComplete(calibrationRecord);
    }

    calculateFinalCost(tiempoReal) {
        const baseCoste = this.calibrationData.tipo.coste_base;
        const tiempoEstimado = this.calibrationData.tipo.tiempo_estimado;
        const factor = tiempoReal / tiempoEstimado;
        return baseCoste * Math.max(0.8, Math.min(1.5, factor));
    }

    showCalibrationComplete(record) {
        const message = record.estado === 'Completado - OK' 
            ? `✅ Calibración completada exitosamente!\n\n📊 Detalles:\n• Tiempo: ${record.tiempo_real} min\n• Coste: €${record.coste_final.toFixed(2)}\n• Vehículo: ${record.vehiculo.marca} ${record.vehiculo.modelo}`
            : `⚠️ Calibración completada con errores\n\n📊 Detalles:\n• Tiempo: ${record.tiempo_real} min\n• Coste: €${record.coste_final.toFixed(2)}\n• Error: ${record.error_descripcion}`;
            
        alert(message);
        
        // Reset wizard
        this.resetCalibration();
        this.showSection('registrar');
    }

    resetCalibration() {
        this.currentCalibration = null;
        this.selectedVehicle = null;
        this.calibrationData = {};
        this.measurements = {};
        this.currentStep = 1;
        
        // Reset forms
        document.querySelectorAll('#registrarSection form').forEach(form => form.reset());
        
        // Show first step
        document.querySelectorAll('.wizard-step').forEach(step => step.classList.add('hidden'));
        document.getElementById('step1')?.classList.remove('hidden');
    }

    // Filter and search functions
    applyFilters() {
        const filters = {
            taller: document.getElementById('filterTaller')?.value,
            estado: document.getElementById('filterEstado')?.value,
            fechaInicio: document.getElementById('filterFechaInicio')?.value,
            fechaFin: document.getElementById('filterFechaFin')?.value,
            tecnico: document.getElementById('filterTecnico')?.value
        };

        let filtered = this.calibrations.filter(cal => {
            let matches = true;
            
            if (filters.taller && cal.taller.id !== filters.taller) matches = false;
            if (filters.estado && cal.estado !== filters.estado) matches = false;
            if (filters.tecnico && cal.usuario.id !== filters.tecnico) matches = false;
            
            if (filters.fechaInicio) {
                const calDate = new Date(cal.fecha_inicio).toISOString().split('T')[0];
                if (calDate < filters.fechaInicio) matches = false;
            }
            
            if (filters.fechaFin) {
                const calDate = new Date(cal.fecha_inicio).toISOString().split('T')[0];
                if (calDate > filters.fechaFin) matches = false;
            }
            
            return matches;
        });

        this.displayCalibrationsList(filtered);
        
        const counter = document.getElementById('resultsCounter');
        if (counter) {
            counter.textContent = `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}`;
        }
    }

    clearFilters() {
        document.querySelectorAll('#consultarSection select, #consultarSection input[type="date"]').forEach(input => {
            input.value = '';
        });
        this.loadCalibrationsList();
    }

    loadCalibrationsList() {
        this.displayCalibrationsList(this.calibrations);
        
        const counter = document.getElementById('resultsCounter');
        if (counter) {
            counter.textContent = `${this.calibrations.length} resultado${this.calibrations.length !== 1 ? 's' : ''}`;
        }
    }

    displayCalibrationsList(calibrations) {
        const container = document.getElementById('calibrationsList');
        if (!container) return;
        
        if (calibrations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state__icon">🔍</div>
                    <p>No se encontraron calibraciones</p>
                </div>
            `;
            return;
        }

        const table = `
            <div class="table-container">
                <table class="calibrations-table">
                    <thead>
                        <tr>
                            <th>📅 Fecha</th>
                            <th>🚗 Vehículo</th>
                            <th>👤 Técnico</th>
                            <th>🏢 Taller</th>
                            <th>🔧 Equipo</th>
                            <th>📊 Estado</th>
                            <th>⏱️ Tiempo</th>
                            <th>💰 Coste</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${calibrations.map(cal => `
                            <tr>
                                <td>${new Date(cal.fecha_inicio).toLocaleDateString('es-ES')}</td>
                                <td>${cal.vehiculo.marca} ${cal.vehiculo.modelo}<br><small>${cal.vehiculo.matricula}</small></td>
                                <td>${cal.usuario.nombre}</td>
                                <td>${cal.taller.nombre}</td>
                                <td>${cal.equipo.fabricante}<br><small>${cal.equipo.modelo}</small></td>
                                <td><span class="status ${this.getStatusClass(cal.estado)}">${cal.estado}</span></td>
                                <td>${cal.tiempo_real} min</td>
                                <td>€${cal.coste_final.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = table;
    }

    getStatusClass(estado) {
        switch (estado) {
            case 'En Proceso': return 'status--warning';
            case 'Completado - OK': return 'status--success';
            case 'Completado - ERROR': return 'status--error';
            default: return 'status--info';
        }
    }

    loadStatistics() {
        console.log('📊 Loading statistics...');
        this.updateStatistics();
        this.loadCharts();
        this.loadHistoricalList();
    }

    updateStatistics() {
        const totalElement = document.getElementById('totalCalibraciones');
        if (totalElement) totalElement.textContent = this.calibrations.length;

        const successfulCals = this.calibrations.filter(cal => cal.estado === 'Completado - OK');
        const successRate = this.calibrations.length > 0 
            ? Math.round((successfulCals.length / this.calibrations.length) * 100)
            : 0;
        const successElement = document.getElementById('tasaExito');
        if (successElement) successElement.textContent = `${successRate}%`;

        const completedCals = this.calibrations.filter(cal => cal.estado.startsWith('Completado'));
        const totalTime = completedCals.reduce((sum, cal) => sum + cal.tiempo_real, 0);
        const avgTime = completedCals.length > 0 ? Math.round(totalTime / completedCals.length) : 0;
        const timeElement = document.getElementById('tiempoPromedio');
        if (timeElement) timeElement.textContent = `${avgTime} min`;

        const totalCost = completedCals.reduce((sum, cal) => sum + cal.coste_final, 0);
        const avgCost = completedCals.length > 0 ? Math.round(totalCost / completedCals.length) : 0;
        const costElement = document.getElementById('costePromedio');
        if (costElement) costElement.textContent = `€${avgCost}`;
    }

    loadCharts() {
        this.loadMonthlyChart();
        this.loadStatusChart();
    }

    loadMonthlyChart() {
        const ctx = document.getElementById('monthlyChart');
        if (!ctx) return;

        // Prepare monthly data
        const monthlyData = {};
        this.calibrations.forEach(cal => {
            const month = new Date(cal.fecha_inicio).toLocaleDateString('es-ES', {year: 'numeric', month: 'short'});
            monthlyData[month] = (monthlyData[month] || 0) + 1;
        });

        const labels = Object.keys(monthlyData).slice(-6);
        const data = labels.map(label => monthlyData[label] || 0);

        // Clear any existing chart
        if (this.monthlyChart) {
            this.monthlyChart.destroy();
        }

        this.monthlyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Calibraciones por Mes',
                    data: data,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    loadStatusChart() {
        const ctx = document.getElementById('statusChart');
        if (!ctx) return;

        // Count by status
        const statusCount = {};
        this.calibrations.forEach(cal => {
            statusCount[cal.estado] = (statusCount[cal.estado] || 0) + 1;
        });

        const labels = Object.keys(statusCount);
        const data = Object.values(statusCount);
        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];

        // Clear any existing chart
        if (this.statusChart) {
            this.statusChart.destroy();
        }

        this.statusChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    loadHistoricalList() {
        const container = document.getElementById('historicalList');
        if (!container) return;
        
        if (this.calibrations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state__icon">📊</div>
                    <p>No hay datos históricos disponibles</p>
                </div>
            `;
            return;
        }

        const sortedCals = [...this.calibrations].sort((a, b) => 
            new Date(b.fecha_inicio) - new Date(a.fecha_inicio)
        );

        this.displayCalibrationsList(sortedCals);
    }

    // Report functions
    updateReportButtons() {
        const select = document.getElementById('selectCalibrationForReport');
        const generateBtn = document.getElementById('generateReportBtn');
        const previewBtn = document.getElementById('previewReportBtn');
        
        const hasSelection = select?.value;
        
        if (generateBtn) generateBtn.disabled = !hasSelection;
        if (previewBtn) previewBtn.disabled = !hasSelection;
    }

    previewReport() {
        const selectElement = document.getElementById('selectCalibrationForReport');
        if (!selectElement?.value) return;

        const calibration = this.calibrations.find(cal => cal.id === selectElement.value);
        if (!calibration) return;

        const reportContent = this.generateReportContent(calibration);
        const previewContainer = document.getElementById('reportContent');
        const previewCard = document.getElementById('reportPreview');

        if (previewContainer && previewCard) {
            previewContainer.innerHTML = reportContent;
            previewCard.classList.remove('hidden');
        }
    }

    generateReport() {
        const selectElement = document.getElementById('selectCalibrationForReport');
        if (!selectElement?.value) return;

        const calibration = this.calibrations.find(cal => cal.id === selectElement.value);
        if (!calibration) return;

        const reportContent = this.generateReportContent(calibration);
        const modalContent = document.getElementById('reportModalContent');
        const modal = document.getElementById('reportModal');

        if (modalContent && modal) {
            modalContent.innerHTML = reportContent;
            modal.classList.remove('hidden');
        }
    }

    generateReportContent(calibration) {
        const fecha = new Date(calibration.fecha_inicio);
        const measurementsHtml = Object.entries(calibration.measurements).map(([key, data]) => `
            <div class="report-measurement">
                <h5>${this.getMedicionLabel(key)}</h5>
                <div class="measurement-details">
                    <div><strong>Valor medido:</strong> ${data.valor} ${data.tolerancia.unidad}</div>
                    <div><strong>Rango permitido:</strong> ${data.tolerancia.min} - ${data.tolerancia.max} ${data.tolerancia.unidad}</div>
                    <div><strong>Estado:</strong> <span class="${data.status === 'ok' ? 'text-success' : 'text-error'}">${data.status === 'ok' ? '✅ DENTRO DE ESPECIFICACIÓN' : '❌ FUERA DE ESPECIFICACIÓN'}</span></div>
                </div>
            </div>
        `).join('');

        return `
            <div class="report-content">
                <div class="report-header">
                    <div>
                        <h1 class="report-title">INFORME DE CALIBRACIÓN ADAS</h1>
                        <p><strong>Taller:</strong> ${calibration.taller.nombre}</p>
                        <p><strong>Dirección:</strong> ${calibration.taller.direccion}, ${calibration.taller.ciudad}</p>
                        <p><strong>Teléfono:</strong> ${calibration.taller.telefono}</p>
                    </div>
                    <div>
                        <p><strong>Fecha:</strong> ${fecha.toLocaleDateString('es-ES')}</p>
                        <p><strong>Nº Informe:</strong> ${calibration.id}</p>
                        <p><strong>Estado:</strong> <strong class="${calibration.estado.includes('OK') ? 'text-success' : 'text-error'}">${calibration.estado}</strong></p>
                    </div>
                </div>

                <div class="report-section">
                    <h3>DATOS DEL VEHÍCULO</h3>
                    <div class="report-info">
                        <div><strong>VIN:</strong> ${calibration.vehiculo.vin || 'N/A'}</div>
                        <div><strong>Matrícula:</strong> ${calibration.vehiculo.matricula}</div>
                        <div><strong>Marca:</strong> ${calibration.vehiculo.marca}</div>
                        <div><strong>Modelo:</strong> ${calibration.vehiculo.modelo}</div>
                        <div><strong>Versión:</strong> ${calibration.vehiculo.version}</div>
                        <div><strong>Año:</strong> ${calibration.vehiculo.año}</div>
                        <div><strong>Motor:</strong> ${calibration.vehiculo.codigo_motor || 'N/A'}</div>
                        <div><strong>Potencia:</strong> ${calibration.vehiculo.potencia}</div>
                        <div><strong>Combustible:</strong> ${calibration.vehiculo.combustible}</div>
                    </div>
                </div>

                <div class="report-section">
                    <h3>INFORMACIÓN DE LA CALIBRACIÓN</h3>
                    <div class="report-info">
                        <div><strong>Motivo:</strong> ${calibration.motivo}</div>
                        <div><strong>Tipo:</strong> ${calibration.tipo_calibracion.nombre}</div>
                        <div><strong>Técnico:</strong> ${calibration.usuario.nombre} (${calibration.usuario.rol})</div>
                        <div><strong>Equipo:</strong> ${calibration.equipo.fabricante} ${calibration.equipo.modelo}</div>
                        <div><strong>Nº Serie Equipo:</strong> ${calibration.equipo.numero_serie}</div>
                        <div><strong>Versión Software:</strong> ${calibration.equipo.version_software}</div>
                        <div><strong>Tiempo empleado:</strong> ${calibration.tiempo_real} minutos</div>
                        <div><strong>Coste:</strong> €${calibration.coste_final.toFixed(2)}</div>
                    </div>
                </div>

                <div class="report-section">
                    <h3>RESULTADOS DE MEDICIONES</h3>
                    <div class="report-measurements">
                        ${measurementsHtml}
                    </div>
                </div>

                ${calibration.error_descripcion ? `
                    <div class="report-section">
                        <h3>INCIDENCIAS</h3>
                        <p><strong>Descripción del error:</strong> ${calibration.error_descripcion}</p>
                        ${calibration.solucion_aplicada ? `<p><strong>Solución aplicada:</strong> ${calibration.solucion_aplicada}</p>` : ''}
                    </div>
                ` : ''}

                ${calibration.observaciones_iniciales || calibration.notas_finales ? `
                    <div class="report-section">
                        <h3>OBSERVACIONES</h3>
                        ${calibration.observaciones_iniciales ? `<p><strong>Observaciones iniciales:</strong> ${calibration.observaciones_iniciales}</p>` : ''}
                        ${calibration.notas_finales ? `<p><strong>Notas finales:</strong> ${calibration.notas_finales}</p>` : ''}
                    </div>
                ` : ''}

                <div class="report-section">
                    <h3>SISTEMAS ADAS DEL VEHÍCULO</h3>
                    <p>${calibration.vehiculo.sistemas_adas.join(', ')}</p>
                    <h3>SENSORES CALIBRADOS</h3>
                    <p>${calibration.vehiculo.sensores.join(', ')}</p>
                </div>

                <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc;">
                    <p><strong>Firma del Técnico: ${calibration.usuario.nombre}</strong></p>
                    <p style="font-size: 12px; color: #666;">
                        Este documento certifica que la calibración ha sido realizada conforme a las especificaciones técnicas del fabricante.
                    </p>
                </div>
            </div>
        `;
    }

    closeReportModal() {
        const modal = document.getElementById('reportModal');
        if (modal) modal.classList.add('hidden');
    }

    downloadReport() {
        alert('📥 Funcionalidad de descarga en desarrollo\n\nEn una implementación real, aquí se generaría y descargaría un archivo PDF con el informe completo.');
    }

    printReport() {
        const printWindow = window.open('', '_blank');
        const reportContent = document.getElementById('reportModalContent');
        
        if (!reportContent) {
            alert('❌ No hay contenido de informe para imprimir');
            return;
        }
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Informe de Calibración ADAS</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .report-content { max-width: none; }
                        .report-header { display: grid; grid-template-columns: 1fr auto; gap: 20px; margin-bottom: 20px; }
                        .report-section { margin-bottom: 20px; }
                        .report-info { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
                        .report-measurements { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
                        .text-success { color: #28a745; }
                        .text-error { color: #dc3545; }
                        h3 { color: #1FB8CD; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
                    </style>
                </head>
                <body>
                    ${reportContent.innerHTML}
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    }
}

// Initialize the system when DOM is ready
console.log('🚀 Initializing ADAS System...');

function initializeSystem() {
    console.log('📅 DOM State:', document.readyState);
    window.adasSystem = new AdasCalibrationSystem();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSystem);
} else {
    initializeSystem();
}

console.log('✅ ADAS System script loaded');