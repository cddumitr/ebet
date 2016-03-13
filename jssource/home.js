$(document).ready(function()
{
	bindBetClick();
	bindStakeChange();
	bindBetSubmit();
	bindInteractions();
});


function bindBetClick()
{
	//click on unselected bet
	$(document).on("click", ".betTableC2.unselected", function()
	{
		$(this).removeClass("unselected").addClass("selected");		
		addBetToSlip($(this).siblings(".betTableC0").text() + " : " + $(this).siblings(".betTableC1").text(), $(this).attr("attr-betid"), $(this).attr("attr-numerator"), $(this).attr("attr-denominator"));
		bindStakeChange();
		if(!$(".betSlipContainer").is(":visible"))
		{
			$(".betSlipContainer").slideDown();
		}
	});
	
	//click on selected bet
	$(document).on("click", ".betTableC2.selected", function()
	{
		$(this).removeClass("selected").addClass("unselected");
		
		//remove corresponding bet from the betting slip
		var strBetId = $(this).attr("attr-betid");
		$(".slipTableBody").children(".slipTableRow[attr-betid=" + strBetId + "]").remove();
		if($(".betSlipContainer").is(":visible") && ($(".slipTableRow").size() == 0))
		{
			$(".betSlipContainer").slideUp();
		}
	});
}

function bindStakeChange()
{
	var dblReturn = 0;
	
	$(".slipTableC2 input").on("change keyup", function()
	{
		dblReturn = parseFloat($(this).val()) * parseFloat($(this).parent().siblings(".slipTableC1").attr("attr-numerator")) / parseFloat($(this).parent().siblings(".slipTableC1").attr("attr-denominator"));
		dblReturn = dblReturn.toFixed(2);
		$(this).parent().siblings(".slipTableC3").text("£ " + dblReturn);		
	});
}	

function addBetToSlip(selection,betId,oddsNumerator,oddsDenominator)
{
	var betHtml = "";
	betHtml += "<tr class='slipTableRow' attr-betid=" + betId + ">";
	betHtml += 		"<th class='slipTableC0'>"  + selection + "</th>";
	betHtml += 		"<th class='slipTableC1' attr-numerator=" + oddsNumerator + " attr-denominator=" + oddsDenominator + ">" + oddsNumerator + " : " + oddsDenominator + "</th>";
	betHtml += 		"<th class='slipTableC2'>£ <input type='number' maxlength='6' name='stake' step='any'></th>";
	betHtml += 		"<th class='slipTableC3'>£ " + "</th>";
	betHtml += "</tr>";
	
	$('.slipTable tr:last').after(betHtml);
   
}

function bindBetSubmit()
{
	var jsonString;
	var blnValidStakes = false;
	
	$(".betSubmit").on("click",function()
	{
		blnValidStakes = validateStakes();
		
		if(blnValidStakes)
		{
			//Loop through each row of the bet slip
			$(".slipTableRow").each(function( index ) 
			{
				var intBetId = parseInt($(this).attr("attr-betid"));
				var intNumerator = parseInt($(this).children(".slipTableC1").attr("attr-numerator"));
				var intDenominator = parseInt($(this).children(".slipTableC1").attr("attr-denominator"));
				var intStake = parseInt($(this).children(".slipTableC2").children("input").val());			
				
				//Populate the json object to be sent
				jsonString = 
				{
					"bet_id" : intBetId,
					"odds" : 
						{
						"numerator" : intNumerator,
						"denominator" : intDenominator
						},
					"stake" : intStake
				};
				//Send POST request using Ajax
				$.ajax({
					url: "http://bedefetechtest.herokuapp.com/v1/bets",
					type: "POST",
					data: JSON.stringify( jsonString ),
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					success: function(data)
					{
						showBetReceipt(	data.event + " - " + data.name, 
										data.odds.numerator + " : " + data.odds.denominator, 
										parseFloat(parseFloat(data.stake) * parseFloat(data.odds.numerator) / parseFloat(data.odds.denominator)).toFixed(2),
										data.transaction_id);					
					},
					failure: function(errMsg) 
					{
						console.log(errMsg);
					}
				});
			 
			});
		}
		
	});
}

function validateStakes()
{
	var blnValid = true;
	//Validate stakes
	$(".slipTableRow").each(function( index ) 
	{
		if(!(parseInt($(this).children(".slipTableC2").children("input").val()) > 0) || ($(this).children(".slipTableC2").children("input").val().indexOf(".") > 0))
		{
			//invalid stake has been detected; output error
			if(blnValid)
			{
				alert("Invalid stake. Please use only integers higher than 0 for stakes");
			}
			blnValid = false;
		}
	});
	return blnValid;
}

function showBetReceipt(strBetName, strOdds, strPayout, strTransactionReference)
{
	var strReceiptHtml = "";
	$(".overlay").show();
	strReceiptHtml += "<div class='receiptContainer'>";	
	strReceiptHtml += 		"<div class='receiptHeader'>Close X</div>";
	strReceiptHtml += 		"<h2>Receipt</h2>";
	strReceiptHtml += 		"<div class='receiptRow'>Bet Name: " + strBetName + "</div>";
	strReceiptHtml += 		"<div class='receiptRow'>Odds: " + strOdds + "</div>";
	strReceiptHtml += 		"<div class='receiptRow'>Payout: £" + strPayout + "</div>";
	strReceiptHtml += 		"<div class='receiptRow'>Transaction reference: " + strTransactionReference + "</div>";
	strReceiptHtml += "</div>";
	$(".overlay").after(strReceiptHtml);
	bindInteractions();
}

function bindInteractions()
{
	$(".overlay").on("click", function()
	{
		$(this).hide();
		$(".receiptContainer").remove();
	});
	
	$(".receiptHeader").on("click", function()
	{
		$(this).parent().remove();
		if($(".receiptContainer").size() == 0)
		{
			$(".overlay").hide();
		}
	});
}
