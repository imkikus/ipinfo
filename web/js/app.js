App.controller('home', function(page) {

  var form = page.querySelector('form'),
      input = page.querySelector('form .app-input');

  var url = 'http://ipinfo.io/json';
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    input.blur();
    if(typeof input.value === 'undefined' || input.value === '') {  
      url = "http://ipinfo.io/json"
    } else {
      url = "http://ipinfo.io/"+input.value+'/json';
    }
    $('.loader').show();
    fetchIp();
  });

  function fetchIp() {
    $.ajax({
      url: url,
      method: 'GET',
      success: function(resp) {
        var $template = $(page).find('.app-section').remove();
        var $container = $(page).find('.ip-details')
        var ip_details = JSON.parse(resp);
        if(ip_details.hostname === 'No Hostname') {
          $template;
          $('.loader').hide();
          App.dialog({
            title: 'Sorry!',
            text: 'Could not find the ip you have specified. Please try again with the valid ip',
            okbutton: 'OK'
          });
        } else {
          var $details = $template.clone(true);
          $details.find('.ip').text(ip_details.ip);
          if(ip_details.hostname) {
            $details.find('.hostname').text(ip_details.hostname);
          } else {
            $details.find('.hostname').text('--');
          }
          if(ip_details.city || ip_details.region || ip_details.country) {
            $details.find('.city').text([ip_details.city, ip_details.region, ip_details.country].join(', '));
          } else {
            $details.find('.city').text('--');
          }
          if(ip_details.org) {
            $details.find('.network').text(ip_details.org);
          } else {
            $details.find('.network').text('--');
          }
          $container.append($details);
          $('.loader').hide();
        }
      },
      error: function(error) {
        $('.loader').hide();
        App.dialog({
          title: 'Oops!',
          text: 'Action ended in error',
          okButton: 'OK'
        })
      }
    });
  }
  fetchIp();
});

try {
  // try to restore previous session
  App.restore();
} catch (err) {
  // else start from scratch
  App.load('home');
}