$(function(){

  $('.city').typeahead({
  source: function(query, process) {
      var url = 'http://open.mapquestapi.com/search?format=json&q=' + query;
      $.getJSON(url, function(data) {
        var out = _.pluck(data, 'display_name');
        process(out);
      });
    },
    minLength: 2
  });

  $('form').submit(function(e) {
    e.preventDefault();
    var formKey = 'dEEycENNYXQtU1RIbzRSYVRxLXFOdHc6MQ';
    var data = $(e.target).serializeArray();
    console.log(data);
    data = JSON.stringify(data);
    gform(formKey, data);
  });


  function gform(fk, val) {
    var gurl = "https://docs.google.com/spreadsheet/formResponse?formkey="+ fk +"&ifq";
    var data = {
      "entry.0.single": val,
      "submit": "Submit",
      "pageNumber":0,
      "backupCache":undefined
    };
    $.post(gurl, data, function(d) {
      console.log('submitted ok');
    });
  }

  $('input[name="exists"]').change(function(){
    var input = $(this);
    if(input.val() !== "Yes") {
      $.each([
          "public",
          "digital",
          "machine-readable",
          "bulk",
          "open-license",
          "up-to-date"
        ],
        function(i, name) {
          $('input[name="' + name + '"][value="'+ input.val() +'"]')
            .prop('checked', true);
        }
      );
    }
  });
  recline.Backend.GDocs.fetch({
    url: 'https://docs.google.com/spreadsheet/ccc?key=0Aon3JiuouxLUdEVHQ0c4RGlRWm9Gak54NGV0UlpfOGc#gid=1'
  }).done(function(result) {
    var select = $('#dataset-select');
    var groups = {};
    _.each(result.records, function(record, i){
      groups[record.category] = groups[record.category] || [];
      groups[record.category].push(record);
    });
    _.each(groups, function(group, key){
      if (!key) { return; }
      var optgroup = $('<optgroup>', {label: key});
      _.each(group, function(record){
        console.log(record);
        optgroup.append('<option value="' + record.datasetquestion + '"> ' + record.datasetquestion + '</option>');
      });
      select.append(optgroup);
    });
  });
});