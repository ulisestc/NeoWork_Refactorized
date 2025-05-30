$(document).ready(function () {
    const $searchInput = $('.input-group input');
    const $searchButton = $('.input-group button');
    const $filters = $('.filters-container select');
    const $jobsContainer = $('#jobs-container');

    // Cargar empleos al iniciar
    loadJobs();

    // Event listeners
    $searchInput.on('input', loadJobs);
    $searchButton.on('click', loadJobs);
    $filters.on('change', loadJobs);

    function renderJobs(jobs) {
        if (!jobs || jobs.length === 0) {
            $jobsContainer.html(`
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    No hay empleos que coincidan con tu búsqueda.
                </div>
            `);
            return;
        }

        const jobsHtml = jobs.map(job => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${job.titulo || 'Título no disponible'}</h5>
                    <a href="../view_reviews_company/view_reviews_company.php?id=${job.id_empresa}"><h6 class="card-subtitle mb-2 text-muted">${job.nombre_empresa || 'Empresa no disponible'}</h6></a>
                    <p class="card-text">
                        <i class="fas fa-map-marker-alt"></i> ${job.direccion || 'Ubicación no disponible'} · 
                        <i class="fas fa-money-bill-wave"></i> ${job.salario || 'Salario no disponible'}
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">Publicado ${job.fecha_publicacion ? formatDate(job.fecha_publicacion) : 'Fecha no disponible'}</small>
                        <a href="../login/login.php" class="btn btn-sm btn-outline-dark">Ver detalles</a>
                    </div>
                </div>
            </div>
        `).join('');

        $jobsContainer.html(jobsHtml);
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-MX', options);
    }

    function loadJobs() {
        const filtersData = {
            search: $searchInput.val(),
            area: $('.filters-container select:nth-child(1)').val(),
            location: $('.filters-container select:nth-child(2)').val(),
            salary: $('.filters-container select:nth-child(3)').val()
        };

        // Debug: mostrar filtros en consola
        console.log('Filtros aplicados:', filtersData);

        // Mostrar loader
        $jobsContainer.html('<div class="alert alert-info">Buscando empleos...</div>');

        // Llamada AJAX al endpoint del API
        $.ajax({
            url: `http://localhost/NeoWork_Refactorized/Routes/getJobs`,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                console.log('Respuesta del servidor:', response);
                if (response.success) {
                    // GUARDAMOS lista de emplkeos
                    const jobs = response.data;
                    // Seleccionamos los filtros
                    const $areaSelect = $('.filters-container select:nth-child(1)');
                    const $locationSelect = $('.filters-container select:nth-child(2)');
                    const $salarySelect = $('.filters-container select:nth-child(3)');
                    //recordamos valor seleccionado de cada filtro 
                    const areaValue = $areaSelect.val();
                    const locationValue = $locationSelect.val();
                    const salaryValue = $salarySelect.val();
                    // Limpiamos los selectores para evitar duplicados (bug lista infinita)
                    $areaSelect.html('<option value="">Todas las áreas</option>');
                    $locationSelect.html('<option value="">Todas las ubicaciones</option>');
                    $salarySelect.html('<option value="">Todos los salarios</option>');
                    // Obtenemos los valores únicos de cada filtro
                    const areas = new Set();
                    const locations = new Set();
                    const salaries = new Set();

                    jobs.forEach(jobs => {
                        if (jobs.area) areas.add(jobs.area);
                        if (jobs.direccion) locations.add(jobs.direccion);
                        if (jobs.salario) salaries.add(jobs.salario);
                    });
                    // Metemos los valores únicos en los selectores
                    areas.forEach(area => $areaSelect.append(`<option value="${area}">${area}</option>`));
                    locations.forEach(location => $locationSelect.append(`<option value="${location}">${location}</option>`));
                    salaries.forEach(salary => $salarySelect.append(`<option value="${salary}">+$${parseInt(salary).toLocaleString()}</option>`));

                    // Seleccionamos el valor que eligió el user
                    $areaSelect.val(areaValue);
                    $locationSelect.val(locationValue);
                    $salarySelect.val(salaryValue);
                    // Filtramos los empleos según los filtros seleccionados
                    if (filtersData.search !== '' || filtersData.area !== null || filtersData.location !== null || filtersData.salary !== null) {
                        response.data = response.data.filter(job => {

                            const search = filtersData.search?.toLowerCase() || "";
                            const jobText = Object.values(job).join(" ").toLowerCase();


                            return (!filtersData.search || jobText.includes(search)) &&
                                (!filtersData.area || job.area === filtersData.area) &&
                                (!filtersData.location || job.direccion === filtersData.location) &&
                                (!filtersData.salary || job.salario === filtersData.salary);
                        });
                    }
                    renderJobs(response.data);
                } else {
                    console.error('Error: La respuesta del servidor no contiene un array de empleos:', response);
                    $jobsContainer.html(`
                        <div class="alert alert-danger">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            Error al cargar empleos: Respuesta inesperada del servidor.
                        </div>
                    `);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                $jobsContainer.html(`
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Error al cargar empleos: ${xhr.responseJSON?.message || 'Intenta nuevamente más tarde.'}
                    </div>
                `);
            }
        });
    }

});