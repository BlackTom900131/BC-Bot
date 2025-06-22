var userId = '', visited = 0, g_gameHash = "";
var avgStep = 0, _step = 0, count10X = 0, condition = 0;
// Update hash

window.addEventListener('message', (event) => {
  if (event.data?.hash) {
    $('#game_hash_input').val(event.data?.hash);
    const gameAmount = Number($('#game_amount_input').val());
    verify(event.data?.hash, gameAmount);

    if (userId) {
      document.getElementById('ethercrash_user_rounds').attr('src', `https://www.ethercrash.io/user/${userId}`);
    }
  }
});

// making bulma.css tabs work

$('.tabs ul li a').click(function () {
  const $this = $(this),
    $tabs = $this.closest('.tabs'),
    $li = $this.closest('li'),
    $lis = $tabs.find('ul > li');
  const id = $tabs.attr('id'),
    index = $lis.index($li);
  $lis.removeClass('is-active');
  $li.addClass('is-active');
  $(`#${id}-content > div`).addClass('is-hidden');
  $(`#${id}-content > div:eq(${index})`).removeClass('is-hidden');
});

function enterLoadState() {
  $('#game_hash_input').parent().addClass('is-loading');
  $('#game_salt_input').parent().addClass('is-loading');
  $('#game_verify_submit, #chart_plus_1_submit, #chart_plus_10_submit, #chart_plus_100_submit').addClass('is-loading');
  $('#game_hash_input, #game_salt_input, #game_amount_input, #game_verify_submit').attr('disabled', 'disabled');
  $('#game_verify_table').html('');
}

function exitLoadState() {
  $('#game_hash_input').parent().removeClass('is-loading');
  $('#game_salt_input').parent().removeClass('is-loading');
  $('#game_verify_submit, #chart_plus_1_submit, #chart_plus_10_submit, #chart_plus_100_submit').removeClass('is-loading');
  $('#game_hash_input, #game_salt_input, #game_amount_input, #game_verify_submit').removeAttr('disabled');
}

var $range = $('.range-analysis');

var isVerifying = false;
var data = [];
var sec_data = [], third_data = [];
var gameRedThresold = 2.0;
var duration = 0;

$('#game_verify_submit').on('click', () => {

  gameRedThresold = Number($('#game_red_thresold_input').val());
  var gameHash = "";
  if ($('#game_hash_input').val().length > 20) {
    gameHash = $('#game_hash_input').val();
    g_gameHash = $('#game_hash_input').val();
  } else {
    gameHash = g_gameHash;
  }

  const gameAmount = Number($('#game_amount_input').val());
  const sec_gameAmount = Number($('#game_amount_input2').val());
  const thir_gameAmount = Number($('#game_amount_input3').val());
  if (gameHash.length > 20) {
    verify(gameHash, gameAmount, sec_gameAmount, thir_gameAmount);
    console.log(gameHash, gameAmount, "-------------test");
  }

});

function verify(gameHash, gameAmount, sec_gameAmount, thir_gameAmount) {
  if (isVerifying) return;
  isVerifying = true;
  enterLoadState();
  $range.empty();
  duration = 0;

  data = [], sec_data = [], third_data = [];

  var index = 0, _index = 0, third_index = 0;

  var current_high_number_than_10 = 0, step = 0;

  let total_count = 0, thirty_hundered_count = 0, twenty_hundered_count = 0, ten_hundered_count = 0, thirty_count = 0, twenty_count = 0, forthy_count = 0, fifty_count = 0, wait_step = 0, sec_count = 0, third_count = 0, forth_count = 0, forbiddenFlag = 0, go_to_the_moon = 0;
  for (let item of gameResults(gameHash, 6000)) {
    wait_step += 1;
    if (wait_step <= 6000 && item.bust >= 10) {
      total_count += 1;
    }
    if (wait_step <= 3000 && item.bust >= 10) {
      thirty_hundered_count += 1;
    }
    if (wait_step <= 2000 && item.bust >= 10) {
      twenty_hundered_count += 1;
    }
    if (wait_step <= 1000 && item.bust >= 10) {
      ten_hundered_count += 1;
    }
    if (wait_step <= 100 && item.bust >= 10) {
      current_high_number_than_10 += 1;
      $('.current_state').text(current_high_number_than_10 + " ~ " + "  Let's go to sleep.");
      $('.current_state').css('background', 'repeating-linear-gradient(45deg, rgb(29 37 48), rgb(32 41 53) 93%)');
    }
    else if (wait_step <= 200 && wait_step >= 100 && item.bust >= 10) {
      sec_count += 1;
    }
    else if (wait_step <= 300 && wait_step >= 200 && item.bust >= 10) {
      third_count += 1;
    }
    else if (wait_step <= 400 && wait_step >= 300 && item.bust >= 10) {
      forth_count += 1;
    }
    else if (wait_step <= 500 && wait_step >= 400 && item.bust >= 10) {
      go_to_the_moon += 1;
    }
    if (wait_step <= 200 && item.bust >= 10) {
      twenty_count += 1;
    }
    if (wait_step <= 300 && item.bust >= 10) {
      thirty_count += 1;
    }
    if (wait_step <= 400 && item.bust >= 10) {
      forthy_count += 1;
    }
    if (wait_step <= 500 && item.bust >= 10) {
      fifty_count += 1;
    }
  }

  avgStep = 0; _step = 0; count10X = 0; condition = 0;

  let jsonData, filteredRanges;

  // const ranges = [
  //   { min: 1.0, max: 1.5, label: 1.0, count: 0, limit: 33 },
  //   { min: 1.51, max: 1.99, label: 1.51, count: 0, limit: 49 },
  //   { min: 2.0, max: 2.5, label: 2.0, count: 0, limit: 45 },
  //   { min: 2.51, max: 2.99, label: 2.51, count: 0, limit: 39 },
  //   { min: 3.0, max: 3.5, label: 3.0, count: 0, limit: 33 },
  //   { min: 3.51, max: 3.99, label: 3.51, count: 0, limit: 28 },
  //   { min: 4.0, max: 4.5, label: 4.0, count: 0, limit: 24 },
  //   { min: 4.51, max: 4.99, label: 4.51, count: 0, limit: 22 },
  //   { min: 5.0, max: 5.5, label: 5.0, count: 0, limit: 19 },
  //   { min: 5.51, max: 5.99, label: 5.51, count: 0, limit: 18 },
  //   { min: 6.0, max: 6.5, label: 6.0, count: 0, limit: 16 },
  //   { min: 6.51, max: 6.99, label: 6.51, count: 0, limit: 15 },
  //   { min: 7.0, max: 7.5, label: 7.0, count: 0, limit: 14 },
  //   { min: 7.51, max: 7.99, label: 7.51, count: 0, limit: 13 },
  //   { min: 8.0, max: 8.5, label: 8.0, count: 0, limit: 12 },
  //   { min: 8.51, max: 8.99, label: 8.51, count: 0, limit: 11 },
  //   { min: 9.0, max: 9.5, label: 9.0, count: 0, limit: 11 },
  //   { min: 9.51, max: 9.99, label: 9.51, count: 0, limit: 10 },
  //   { min: 10.0, max: Infinity, label: 10.0, count: 0, limit: 9 }
  // ];
  // for (let item of gameResults(gameHash, 100)) {
  //   for (let range of ranges) {
  //     if (item.bust >= range.min && item.bust <= range.max) {
  //       range.count++;
  //       break;
  //     }
  //   }
  // }

  // filteredRanges = ranges
  //   .filter(range => range.count < range.limit)
  //   .sort((a, b) => b.count - a.count)
  //   .slice(0, 5);

  // jsonData = JSON.stringify(filteredRanges.map(range => [range.label, range.count]));

  // var smallestMinRange = filteredRanges.reduce((minRange, currentRange) =>
  //   currentRange.min < minRange.min ? currentRange : minRange, filteredRanges[0]);

  // console.log("Top 5 ranges:", jsonData);
  // console.log("Smallest min range:", JSON.stringify(smallestMinRange, null, 2));

  // $('.wait_notice').text(smallestMinRange.min + "~" + smallestMinRange.max);

  for (let item of gameResults(gameHash, 180)) {
    _step++;
    if (item.bust >= 10) { count10X++; }

    avgStep = _step / (count10X == 0 ? 1 : count10X);

    if (count10X == 0 && avgStep >= 45) { condition = 1; break; }
    if (count10X == 1 && avgStep >= 60) { condition = 1; break; }
    if (count10X == 2 && avgStep >= 35) { condition = 1; break; }
    if (count10X == 3 && avgStep >= 25) { condition = 1; break; }
    if (count10X == 4 && avgStep >= 22) { condition = 1; break; }
    if (count10X == 5 && avgStep >= 20) { condition = 1; break; }
    if (count10X == 6 && avgStep >= 19) { condition = 1; break; }
    if (count10X == 7 && avgStep >= 18) { condition = 1; break; }
    if (count10X == 8 && avgStep >= 17) { condition = 1; break; }
    if (count10X == 9 && avgStep >= 16) { condition = 1; break; }
    if (count10X == 10 && avgStep >= 15) { condition = 1; break; }
    if (count10X == 11 && avgStep >= 14) { condition = 1; break; }
  }

  if (condition == 1) {
    let len = _step * 3 > 300 ? _step * 3 : 300;
    let endStep = 0, forth_key = 0, forth_value_len = 0, first_key = 0, first_value_len = 0, second_key = 0, second_value_len = 0, third_key = 0, third_value_len = 0, update10x = count10X;

    for (let item of gameResults(gameHash, len)) {
      endStep += 1;

      // 1.2x 
      if (item.bust < 1.2 && forth_key !== 2) {
        forth_value_len += 1;
      }

      if (item.bust >= 1.2) { forth_key = 2; }

      // 2x 
      if (item.bust < 2 && first_key !== 2) {
        first_value_len += 1;
      }

      if (item.bust >= 2) { first_key = 2; }

      // 1.5x
      if (item.bust < 1.5 && second_key !== 2) {
        second_value_len += 1;
      }

      if (item.bust >= 1.5) { second_key = 2; }

      // 3x
      if (item.bust < 3 && third_key !== 2) {
        third_value_len += 1;
      }

      if (item.bust >= 3) { third_key = 2; }

      if (item.bust >= 10 && _step < endStep) {
        _step++;
        update10x++;
      }
    }
    avgStep = len / (update10x == 0 ? 1 : update10x);

    if (first_value_len >= 8) {
      good_way(2, first_value_len, 1);
    }

    if (second_value_len >= 5) {
      good_way(1.5, second_value_len, 1);
    }

    if (third_value_len >= 12) {
      good_way(3, third_value_len, 1);
    }

    if (forth_value_len >= 3) {
      good_way(3, forth_value_len, 1);
    }

    if (avgStep > 10) {
      good_way(0, 0, 0);
    }

    if (avgStep < 10) {
      $('.wait_notice').text('Wait !');
      $('.wait_notice').css('background', '#f14668').css('padding-left', '20px').css('display', 'flex').css('align-items', 'center').css('width', '120px').css('font-size', '30px').css('border-radius', '50%').css('color', 'white').css('border', '2px solid white').css('box-shadow', '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgb(255 255 255 / 88%)');
    }
  }

  for (let item of gameResults(gameHash, gameAmount)) {
    setTimeout(addTableRow.bind(null, item.hash, item.bust, data.length), data.length * 1);
    data.unshift({ ...item, index: ++index });
    duration += Math.log(item.bust || 1) / 0.00006;
  }

  // $('.current_state').text(go_to_the_moon + " / " + forth_count + " / " + third_count +
  //   " / " + sec_count + ' / ' + current_high_number_than_10 + '  .  ' + ' ? : ' + smallestMinRange.min + "~" + smallestMinRange.max);


  let shortValue = thirty_count / 3;
  
  let middleValue = (((ten_hundered_count - thirty_count) / 7) * 2) / 3 + thirty_count /  3  / 3;

  let longValue = (((twenty_hundered_count - fifty_count ) / 15 ) * 2) / 3 + fifty_count / 5 / 3;

  console.log(thirty_count,current_high_number_than_10, shortValue, middleValue, longValue, "--------")
  
  $('.current_state').text(go_to_the_moon + " / " + forth_count + " / " + third_count +
    " / " + sec_count + ' / ' + current_high_number_than_10 + ' . ' +"    (" +shortValue.toFixed(1) +") " +" (" +middleValue.toFixed(1) +") " +" (" +longValue.toFixed(1) +")");

  $('.current_all_state').text(total_count + " / " + thirty_hundered_count + " / " + twenty_hundered_count + " / " + ten_hundered_count + " : " + fifty_count + " / " + forthy_count + " / " + thirty_count +
    " / " + twenty_count + ' / ' + current_high_number_than_10 + '  .  ')


  // if (current_high_number_than_10 <= 6 && sec_count <= 8 && third_count <= 8 && forth_count <= 8) {
  //   let interval;
  //   interval = setInterval(() => {
  //     showCustomNotification("-- :  Hurry up. A great opportunity has come to you.");
  //   }, 1000)
  //   $('.wait_notice').text('Good !');
  //   $('.wait_notice').css('background', 'repeating-radial-gradient(#e1ff00, #d19b9b42 100px)').css('padding-left', '20px').css('display', 'flex').css('align-items', 'center').css('width', '120px').css('font-size', '30px').css('border-radius', '50%').css('color', '#d70a0a').css('border', '2px solid white').css('box-shadow', '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgb(255 255 255 / 88%)');
  // }
  // else {
  //   $('.wait_notice').text('Wait !');
  //   $('.wait_notice').css('background', '#f14668').css('padding-left', '20px').css('display', 'flex').css('align-items', 'center').css('width', '120px').css('font-size', '30px').css('border-radius', '50%').css('color', 'white').css('border', '2px solid white').css('box-shadow', '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgb(255 255 255 / 88%)');

  // }

  for (let item of gameResults(gameHash, sec_gameAmount)) {
    setTimeout(addTableRow.bind(null, item.hash, item.bust, sec_data.length), sec_data.length * 1);
    sec_data.unshift({ ...item, index: ++_index });
    duration += Math.log(item.bust || 1) / 0.00006;
  }

  // Range Analysis 

  for (let item of gameResults(gameHash, thir_gameAmount)) {
    setTimeout(addTableRow.bind(null, item.hash, item.bust, third_data.length), third_data.length * 1);
    third_data.unshift({ ...item, index: ++third_index });
    duration += Math.log(item.bust || 1) / 0.00006;
  }

  // Range Analysis
  [1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((v) => showRangeAnalysis(data, v));

  showSequenceRed();
  drawChart();
}

$('.current_state').css('background', 'repeating-linear-gradient(45deg, #c4d345, #d32020fa 90%)');

function showRangeAnalysis(data, bust) {
  var aboveItems = data.filter((v) => v.bust >= bust);

  var delta = 0,
    totalDelta = 0,
    minDelta = 99999,
    avgDelta = 0,
    maxDelta = 0;
  var aboveRounds = '';

  var lastIndex = 0;
  aboveItems.reverse().forEach((item) => {
    aboveRounds && (aboveRounds += ', ');
    aboveRounds += `x${item.bust}/${item.index}`;

    if (lastIndex > 0) {
      delta = item.index - lastIndex;

      if (delta < minDelta) {
        minDelta = delta;
      }

      if (delta > maxDelta) {
        maxDelta = delta;
      }
      totalDelta += delta;
    }

    lastIndex = item.index;
  });
  avgDelta = totalDelta / (aboveItems.length - 1);

  if (!aboveItems.length) {
    minDelta = avgDelta = maxDelta = 0;
  }

  if (aboveItems.length === 1) {
    minDelta = avgDelta = maxDelta = aboveItems[0].index;
  }

  var $div = $('<div>').css('margin-bottom', 10);
  var $label = $('<label>').text(`Above x${bust} : ${aboveItems.length}`).css('font-weight', 'bold').css('color', 'rgb(18 35 27)');
  var $label3 = $('<label>')
    .text(`min: ${minDelta}, avg: ${Math.round(avgDelta)}, max: ${maxDelta}`)
    .css('font-weight', '500').css('color', 'black');

  [$label, $label3].forEach((el) => $div.append(el.css('display', 'block')));
  $range.append($div);
}

function good_way(fixed_x, fixed_x_count, state) {
  if (state === 0) {
    showCustomNotification("-- :  Hurry up. A great opportunity has come to you." + " Dist= " + _step + " 10X =" + count10X + " - avg =" + avgStep.toFixed(2));
  }
  else {
    showCustomNotification("-- :  Hurry up. A great opportunity has come to you. -- " + fixed_x + " count =  " + fixed_x_count);
  }

  $('.wait_notice').text('Good !');
  $('.wait_notice').css('background', 'repeating-radial-gradient(#e1ff00, #d19b9b42 100px)').css('padding-left', '20px').css('display', 'flex').css('align-items', 'center').css('width', '120px').css('font-size', '30px').css('border-radius', '50%').css('color', '#d70a0a').css('border', '2px solid white').css('box-shadow', '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgb(255 255 255 / 88%)');
}

function showCustomNotification(message) {
  const customNotification = document.getElementById("customNotification");
  const messageContainer = document.getElementById("notificationMessage");

  messageContainer.textContent = message;
  customNotification.style.display = "flex";

  customNotification.onclick = () => {
    customNotification.style.display = "none";
    clearInterval(interval);
  };

}

function subString(text, limitLength) {
  if (text.length > limitLength) {
    return text.substring(0, limitLength) + '...';
  } else {
    return text;
  }
}

function gameResultsAdd(data, amount) {
  var index = data[0].index;
  var hash = CryptoJS.SHA256(data[0].hash);
  for (let item of gameResults(hash, amount)) {
    setTimeout(addTableRow.bind(null, item.hash, item.bust, amount), amount * 1);
    data.unshift({ ...item, index: ++index });
    duration += Math.log(item.bust || 1) / 0.00006;
  }

  // Range Analysis
  $range.empty();
  [3, 5, 10, 20, 50, 100].forEach((v) => showRangeAnalysis(data, v));
  showSequenceRed();
  drawChart();
}

function showSequenceRed() {
  var seq_red_count = 0;
  var max_seq_red_count = 0;
  var total_red_count = 0;

  data.forEach(d => {
    if (d.bust < gameRedThresold) {
      seq_red_count++;
    } else {
      max_seq_red_count = Math.max(seq_red_count, max_seq_red_count);
      total_red_count += seq_red_count;
      seq_red_count = 0;
    }
  });

  $('#game_max_red_sequence_count_in_table').text(max_seq_red_count);
  $('#game_max_red_sequence_count_in_chart').text(max_seq_red_count);

  var total_blue_count = data.length - total_red_count;
  var house_edge = (total_blue_count - total_red_count) * 100 / data.length;
  // $('#game_info').text(`Total Duration: ${msToTime(duration)}, Blue: ${total_blue_count}, Red: ${total_red_count}, Sub: ${total_blue_count - total_red_count}, House Edge: ${house_edge.toFixed(2)}%`);
}


$('#chart_plus_50_submit').on('click', () => {
  document.getElementById("game_amount_input").value = Number($('#game_amount_input').val()) + 50;
  data = [];
  $('#game_verify_submit').click();
});

$('#chart_plus_100_submit').on('click', () => {
  document.getElementById("game_amount_input").value = Number($('#game_amount_input').val()) + 100;
  data = [];
  $('#game_verify_submit').click();
});

$('#chart_minus_100_submit').on('click', () => {
  if (Number($('#game_amount_input').val()) - 100 >= 50) {
    document.getElementById("game_amount_input").value = Number($('#game_amount_input').val()) - 100;
    data = [];
    $('#game_verify_submit').click();
  }
});

$('#chart_minus_50_submit ').on('click', () => {
  if (Number($('#game_amount_input').val()) - 50 >= 50) {
    document.getElementById("game_amount_input").value = Number($('#game_amount_input').val()) - 50;
    data = [];
    $('#game_verify_submit').click();
  }
});

$('#chart_set_100_submit').on('click', () => {
  document.getElementById("game_amount_input").value = 100;
  data = [];
  $('#game_verify_submit').click();
});

$('#chart_set_1000_submit').on('click', () => {
  document.getElementById("game_amount_input").value = 1000;
  data = [];
  $('#game_verify_submit').click();
});

$('#chart_set_500_submit').on('click', () => {
  document.getElementById("game_amount_input").value = 500;
  data = [];
  $('#game_verify_submit').click();
});

$('#game_amount_input').on('keyup', () => {
  if ($('#game_amount_input').val() >= 10000) {
    if ($('#game_verify_warning').length) return;
    $('#game_verify_submit')
      .parent()
      .append(
        $('<span/>')
          .attr({
            id: 'game_verify_warning',
            class: 'tag is-warning',
          })
          .text('Verifying a huge amount of games may consume more ressources from your CPU')
      );
  } else {
    if ($('#game_verify_warning').length) {
      $('#game_verify_warning').remove();
    }
  }
});

const addTableRow = (hash, bust, index) => {
  $('<tr/>')
    .attr({
      class: index === 0 ? 'is-first' : null,
    })
    .append($('<td/>').text(hash))
    .append(
      $('<td/>')
        .text(bust)
        .attr({
          class: bust >= gameRedThresold ? 'is-over-median' : 'is-under-median',
        })
    )
    .appendToWithIndex($('#game_verify_table'), index);

  if (index >= $('#game_amount_input').val() - 1) {
    exitLoadState();
    isVerifying = false;
  }
};

$.fn.appendToWithIndex = function (to, index) {
  if (!(to instanceof jQuery)) {
    to = $(to);
  }
  if (index === 0) {
    $(this).prependTo(to);
  } else {
    $(this).insertAfter(to.children().eq(index - 1));
  }
};

function prob(multiplier) {
  if (Array.isArray(multiplier)) {
    return multiplier.reduce((accumulator, item) => {
      return accumulator * prob(item);
    }, 1);
  } else if (!isNaN(multiplier)) {
    return 0.99 / multiplier;
  } else {
    throw new Error(`multiplier must be a number or array instead of '${typeof multiplier}'.`);
  }
}

prob.invert = function (probability) {
  if (Array.isArray(probability)) {
    let result = [];
    if (probability.length > 0) result[0] = prob.invert(probability[0]);
    for (let i = 1; i < probability.length; i++) {
      result.push(prob.invert(probability[i] / probability[i - 1]));
      if (result[result.length - 1] < 1.01) {
        throw new Error(`probability[${i}] is impossible.`);
      }
    }
    return result;
  } else if (!isNaN(probability)) {
    return 0.99 / probability;
  } else {
    throw new Error(`probability must be a number or array instead of '${typeof probability}'.`);
  }
};

function* gameResults(gameHash, gameAmount) {
  let salt = $('#game_salt_input').val();
  let prevHash = null;
  for (let index = 0; index < gameAmount; index++) {
    let hash = String(prevHash ? CryptoJS.SHA256(String(prevHash)) : gameHash);
    let bust = salt.startsWith('0x') ? gameResultForEthercrash(hash, salt) : gameResult(hash, salt);
    yield { hash, bust };
    prevHash = hash;
  }
}

function divisible(hash, mod) {
  // So ABCDEFGHIJ should be chunked like  AB CDEF GHIJ
  var val = 0;

  var o = hash.length % 4;
  for (var i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
    val = ((val << 16) + parseInt(hash.substring(i, i + 4), 16)) % mod;
  }

  return val === 0;
}

function hmac(key, v) {
  var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
  return hmacHasher.finalize(v).toString();
}

function gameResultForEthercrash(serverSeed, salt) {
  var hash = hmac(serverSeed, salt);

  if (divisible(hash, 101)) return 0;

  var h = parseInt(hash.slice(0, 52 / 4), 16);
  var e = Math.pow(2, 52);

  return (Math.floor((100 * e - h) / (e - h)) / 100).toFixed(2);
}

function gameResult(seed, salt) {
  const nBits = 52;

  const hmac = CryptoJS.HmacSHA256(CryptoJS.enc.Hex.parse(seed), salt);
  seed = hmac.toString(CryptoJS.enc.Hex);

  seed = seed.slice(0, nBits / 4);
  const r = parseInt(seed, 16);

  // 3. X = r / 2^52
  let X = r / Math.pow(2, nBits); // uniformly distributed in [0; 1)

  // 4. X = 99 / (1-X)
  X = 99 / (1 - X);

  // 5. return max(trunc(X), 100)
  const result = Math.floor(X);
  return Math.max(1, result / 100);
}

var mychart = null, secchart = null, thirdchart = null;

function drawChart() {
  const ctx = document.getElementById('chartjs_container');
  const ctx2 = document.getElementById('chartjs_container_sec');
  const ctx3 = document.getElementById('chartjs_container_third');

  const chartData = {
    labels: data.map((d) => d.bust),
    datasets: [
      {
        label: '',
        data: data.map((d) => d.bust),
        backgroundColor: (ctx) => {
          if (ctx.raw < gameRedThresold) {
            return 'red';
          } else if (ctx.raw >= 100) {
            return '#e69b00';  // dark yellow
          } else if (ctx.raw >= 10) {
            return 'yellow';
          }

          return 'green';
        },
      },
    ],
  };
  $('#draw-chart').html('');
  data.map((d, index) => {
    visited += 1;

    const reverseIndex = data.length - index;

    let e;
    if (d.bust > 2 && d.bust < 10) {
      e = `
            <div class="over-num" data-index="${reverseIndex}" style="cursor:pointer; background: #008000; width: 39px; height: 27px; text-align: center; border-radius: 3px; color: #faf5ff; margin-left: 1px;">
              ${d.bust}
            </div>
          `;
    }
    else if (d.bust > 10 && d.bust < 50) {
      e = `
            <div class="over-num" data-index="${reverseIndex}" style="cursor:pointer; background: #eded1e; width: 39px; height: 27px; text-align: center; border-radius: 3px; color: #6d635d; margin-left: 1px; border: 1px solid #8d5b5b;">
              ${d.bust}
            </div>
          `;
    }
    else if (d.bust < 2 && d.bust > 1.5) {
      e = `
            <div class="over-num" data-index="${reverseIndex}" style="cursor:pointer; background: #ed6300; width: 39px; height: 27px; text-align: center; border-radius:3px; color: #f6f4f3; margin-left: 1px; border: 1px solid #8d5b5b;">
              ${d.bust}
            </div>
          `;
    } else if (d.bust < 1.5) {
      e = `
            <div class="over-num" data-index="${reverseIndex}" style="cursor:pointer; background: #ed6300; width: 39px; height: 27px; text-align: center; border-radius: 3px; color: #f6f4f3; margin-left: 1px; border: 1px solid #8d5b5b;">
              ${d.bust}
            </div>
          `;
    } else if (d.bust >= 50) {
      e = `
            <div class="over-num" data-index="${reverseIndex}" style="cursor:pointer; background: #f6c722; width: 39px; height: 27px; text-align: center; border-radius: 3px; color: green; margin-left: 1px;">
              ${d.bust}
            </div>
          `;
    }
    $('#draw-chart').append(e);
  });

  $('#draw-chart').on('mouseover', '.over-num', function () {
    const reverseIndex = $(this).data('index');

    const tooltip = $('<div class="tooltip"></div>').text(`Index: ${reverseIndex}`);
    tooltip.css({
      position: 'absolute',
      padding: '5px 10px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      borderRadius: '4px',
      fontSize: '12px',
      pointerEvents: 'none',
      zIndex: 1000,
    });

    $('body').append(tooltip);

    $(this).on('mousemove.tooltip', function (e) {
      tooltip.css({
        top: e.pageY + 10 + 'px',
        left: e.pageX + 10 + 'px',
      });
    });

    $(this).on('mouseout.tooltip', function () {
      tooltip.remove();
      $(this).off('.tooltip');
    });
  });

  const sec_chartData = {
    labels: sec_data.map((d) => d.bust),
    datasets: [
      {
        label: '',
        data: sec_data.map((d) => d.bust),
        backgroundColor: (ctx) => {
          if (ctx.raw < gameRedThresold) {
            return 'red';
          } else if (ctx.raw >= 100) {
            return '#e69b00';  // dark yellow
          } else if (ctx.raw >= 10) {
            return 'yellow';
          }

          return 'green';
        },
      },
    ],
  };

  const thir_chartData = {
    labels: third_data.map((d) => d.bust),
    datasets: [
      {
        label: '',
        data: third_data.map((d) => d.bust),
        backgroundColor: (ctx) => {
          if (ctx.raw < gameRedThresold) {
            return 'red';
          } else if (ctx.raw >= 100) {
            return '#e69b00';
          } else if (ctx.raw >= 10) {
            return 'yellow';
          }
          return 'green';
        },
      },
    ],
  };

  const config = {
    type: 'bar',
    data: chartData, // Ensure `chartData` is defined elsewhere
    options: {
      responsive: true,
      scales: {
        x: {
          grid: {
            offset: false,
          },
          ticks: {
            autoSkip: chartData.labels.length > 50, // Use `chartData.labels.length` to determine autoskip
          },
        },
        y: {
          beginAtZero: true,
          max: 50,
          ticks: {
            callback: function (value, index, ticks) {
              return value + 'x';
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true, // Ensure tooltips are enabled
          callbacks: {
            label: function (context) {
              const data = context.chart.data.datasets[0].data; // Access the data array
              const currentIndex = context.dataIndex;
              const lastIndex = data.length - 1;

              // Calculate distance from the last index
              const distanceFromLast = lastIndex - currentIndex;

              // Get the range of values from the current index to the last index
              const rangeValues = data.slice(currentIndex);

              // Count numbers greater than 10 in the range
              const countGreaterThan10 = rangeValues.filter(value => value > 10).length;

              return `Index: ${currentIndex}, >10 Count: ${countGreaterThan10}, Distance from Last: ${distanceFromLast}`;
            },
          },
        },
      },
    },
  };

  const config3 = {
    type: 'bar',
    data: thir_chartData, // Ensure `chartData` is defined elsewhere
    options: {
      responsive: true,
      scales: {
        x: {
          grid: {
            offset: false,
          },
          ticks: {
            autoSkip: chartData.labels.length > 50, // Use `chartData.labels.length` to determine autoskip
          },
        },
        y: {
          beginAtZero: true,
          max: 50,
          ticks: {
            callback: function (value, index, ticks) {
              return value + 'x';
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true, // Ensure tooltips are enabled
          callbacks: {
            label: function (context) {
              const data = context.chart.data.datasets[0].data; // Access the data array
              const currentIndex = context.dataIndex;
              const lastIndex = data.length - 1;

              // Calculate distance from the last index
              const distanceFromLast = lastIndex - currentIndex;

              // Get the range of values from the current index to the last index
              const rangeValues = data.slice(currentIndex);

              // Count numbers greater than 10 in the range
              const countGreaterThan10 = rangeValues.filter(value => value > 10).length;

              return `Index: ${currentIndex}, >10 Count: ${countGreaterThan10}, Distance from Last: ${distanceFromLast}`;
            },
          },
        },
      },
    },
  };

  const config2 = {
    type: 'bar',
    data: sec_chartData, // Ensure `chartData` is defined elsewhere
    options: {
      responsive: true,
      scales: {
        x: {
          grid: {
            offset: false,
          },
          ticks: {
            autoSkip: chartData.labels.length > 50, // Use `chartData.labels.length` to determine autoskip
          },
        },
        y: {
          beginAtZero: true,
          max: 50,
          ticks: {
            callback: function (value, index, ticks) {
              return value + 'x';
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true, // Ensure tooltips are enabled
          callbacks: {
            label: function (context) {
              const data = context.chart.data.datasets[0].data; // Access the data array
              const currentIndex = context.dataIndex;
              const lastIndex = data.length - 1;

              // Calculate distance from the last index
              const distanceFromLast = lastIndex - currentIndex;

              // Get the range of values from the current index to the last index
              const rangeValues = data.slice(currentIndex);

              // Count numbers greater than 10 in the range
              const countGreaterThan10 = rangeValues.filter(value => value > 10).length;

              return `Index: ${currentIndex}, >10 Count: ${countGreaterThan10}, Distance from Last: ${distanceFromLast}`;
            },
          },
        },
      },
    },
  };

  if (mychart) {
    mychart.destroy();
  }
  mychart = new Chart(ctx, config);

  if (secchart) secchart.destroy();
  secchart = new Chart(ctx2, config2);

  if (thirdchart) thirdchart.destroy();
  thirdchart = new Chart(ctx3, config3);
}

$('#game_verify_submit').click();

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
    days = Math.floor(duration / (1000 * 60 * 60 * 24));

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return (days > 0 ? days + "d " : "") + hours + "h " + minutes + "m " + seconds + "s";
}

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
  return false;
};


$('#game_analyze').on('keyup', (e) => {
  if (e.keyCode == 13) {
    $('.range-analysis').html("");
    var analyzeVal = $('#game_analyze').val().split(",");
    analyzeVal.forEach((v) => showRangeAnalysis(data, v));
  }
});


$(function () {
  var game = getUrlParameter('game');
  if (game === 'ethercrash') {
    $('#game_salt_input').val('0xd8b8a187d5865a733680b4bf4d612afec9c6829285d77f438cd70695fb946801');
  } else if (game === 'bustabit') {
    $('#game_salt_input').val('0000000000000000004d6ec16dafe9d8370958664c1dc422f452892264c59526');
  }

  userId = getUrlParameter('userid');
  if (userId) {
    $('#ethercrash_user_rounds').attr('src', `https://www.ethercrash.io/user/${userId}`);
    $('#user_rounds_tab').removeClass('is-hidden');
  }
});

$('#toggle_theme_button').on('click', () => {
  const isDarkMode = $('body').hasClass('dark');
  if (isDarkMode) {
    $('body').removeClass('dark');
  } else {
    $('body').addClass('dark');
  }
});

function websiteVisits(response) {
  document.querySelector("#visits").textContent = response.value;
}
