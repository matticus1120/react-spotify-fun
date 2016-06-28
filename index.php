<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>React Spotify API Things</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
</head>
<body>
<script src="build/react.js"></script>
<script src="build/react-dom.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.24/browser.min.js"></script>
<!-- <script src="app.js"></script> -->
<script src="react-app.js" type="text/babel"></script>

<div class="container">
	<div class="row">
		<div class="col-md-2"></div>
		<div class="col-md-8 text-center">
			<div>
				 <div id="example"></div>
			</div>
			<div class="container">
				<div id="search-app">
					<table class="table results-table table-bordered table-hover table-striped">
						<thead>
							<tr>
								<th>#</th>
								<th>Artist</th>
								<th># of Followers</th>
								<th>Genres</th>
							</tr>
						</thead>
						<tbody id="results-body"></tbody>
					</table>
				</div>
			</div>

		</div>
		<div class="col-md-2"></div>
	</div>
</div>


</body>
</html>