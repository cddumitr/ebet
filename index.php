
<html>
	<head>
		<title>Football Betting</title>
		<link rel="stylesheet" type="text/css" href="home.css" media="all" />
		<script type="text/javascript" src="./jssource/jquery-1.8.2.js"></script>
		<script type="text/javascript" src="./jssource/home.js"></script>
	</head>
	<body>
		<?php
		// simple GET Request
		
			
		// Resource Address
		$url="http://bedefetechtest.herokuapp.com/v1/markets";
		
		
		// Send GET/PUT/POST request to Resource
		$client=curl_init($url);
		
		curl_setopt($client,CURLOPT_RETURNTRANSFER,1);
		
		// get response to Resource
		$response=curl_exec($client);
		
		// decode
		$result=json_decode($response);
		?>
		
		<div id="mainContainer">
			<h2>Football betting</h2>
			<table class="betTable" cellpadding="2" cellspacing="0" border="1">
				<tbody class="betTableBody">
					<tr class="betTableHeader">
						<th class="betTableH0">Event</th>
						<th class="betTableH1">Team</th>
						<th class="betTableH2">Odds</th>
					</tr>
					<?php
					foreach ($result as $item) 
					{
					?>
					<tr class="betTableRow">
						<th class="betTableC0"><?php print_r($item->event);?></th>
						<th class="betTableC1"><?php print_r($item->name);?></th>
						<th class="betTableC2 pushable unselected" attr-betid=<?php print_r($item->bet_id);?> attr-numerator=<?php print_r($item->odds->numerator);?> attr-denominator=<?php print_r($item->odds->denominator);?>>
							<?php print_r($item->odds->numerator);?>&nbsp;:&nbsp;<?php print_r($item->odds->denominator);?>
						</th>					
					</tr>
					<?php
					}
					?>
				</tbody>
			</table>
			</br>
			<div class="betSlipContainer">
				<div class="betSlipHeader">
					<h3>Bet Slip</h3>
				</div>
				<table class="slipTable" cellpadding="2" cellspacing="0" border="1">
					<tbody class="slipTableBody">
						<tr class="slipTableHeader">
							<th class="slipTableH0">Selection</th>
							<th class="slipTableH1">Odds</th>
							<th class="slipTableH2">Stake</th>
							<th class="slipTableH3">Returns</th>
						</tr>
					</tbody>
				</table>
				</br>
				<div class="betSubmit pushable">Place bet</div>
			</div>			
		</div>
		<div class="overlay"></div>
	</body>

</html>




