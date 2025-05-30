<?php
    session_start();
    $company_id = isset($_GET['id']) ? $_GET['id'] : (isset($_SESSION['id_empresa']) ? $_SESSION['id_empresa'] : null);
    $user_type = isset($_SESSION['user_type']) ? $_SESSION['user_type'] : null;
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reseñas de la empresa - NeoWork</title>
    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <!-- estilos propios -->
    <link rel="stylesheet" type="text/css" href="../styles/styles.css" />
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
    <!-- icon -->
    <link rel="icon" type="image/x-icon" href="../styles/favicon.ico">
    <script>
        window.USER_ID = <?php echo json_encode($company_id); ?>;
        window.USER_TYPE = <?php echo json_encode($user_type); ?>;
    </script>
</head>

<body>
    <header class="header d-flex justify-content-between align-items-center px-4 py-3">
        <h2 class="mb-0"><a id="headerLogo" href="../../index.php" class="text-decoration-none"><strong>NeoWork</strong></a></h2>
        <div id="header-buttons" class="d-flex">
        </div>
    </header>

    <main class="container mt-4">
        <div class="card mb-4">
            <div class="card-body">
                <!-- Título y botón -->
                <div class=" d-flex justify-content-center align-items-center mb-4">
                    <h2  class="mb-0">Reseñas de la empresa</h2>
                </div>
                
                <!-- Contenedor de reseñas -->
                <div id="reviews-container">
                    <!-- Las reseñas se cargarán aquí dinámicamente -->
                </div>
                
                <a id="add-review" href="../add_review/add_review.php?id_empresa=<?php echo $company_id; ?>" class="btn btn-primary">
                    <i class="fas fa-plus me-2">Agregar Reseña</i>
                </a>
                <br><br>
                <div id="regresar" class="mb-3 text-center">

                </div>
            </div>
        </div>
    </main>

    <?php include '../templates/footer.php' ?>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="view_reviews_company.js"></script>
</body>
</html>