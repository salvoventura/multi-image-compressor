/*
   Modified by: Salvatore Ventura <salvoventura@gmail.com>
   Date: 11 May 2018
   Purpose: enable multi-image processing
*/

window.addEventListener('DOMContentLoaded', function () {
  var Vue = window.Vue;
  var URL = window.URL || window.webkitURL;
  var ImageCompressor = window.ImageCompressor;

  new Vue({
    el: '#app',

    data: function () {
      var vm = this;

      return {
        options: {
          maxWidth: undefined,
          maxHeight: undefined,
          minWidth: 0,
          minHeight: 0,
          width: undefined,
          height: undefined,
          quality: 0.8,
          mimeType: '',
          convertSize: 5000000,
          success: function (file) {
            // Compression success
            console.log('Output: ', file);

            // for each image, prompt user to save
            var a = document.createElement("a"), url = URL.createObjectURL(file);
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            
            // log processed files
            var l = document.createElement("li");
            l.innerHTML = file.name;

            // proceed to save
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
            
            // append the log
            vm.$refs.outlog.appendChild(l);

            vm.$refs.input.value = '';
          },
          error: function (e) {
            window.alert(e.message);
          },
        },
        inputURL: '',
        outputURL: '',
        input: {},
        output: {},
      };
    },

    filters: {
      prettySize: function (size) {
        var kilobyte = 1024;
        var megabyte = kilobyte * kilobyte;

        if (size > megabyte) {
          return (size / megabyte).toFixed(2) + ' MB';
        } else if (size > kilobyte) {
          return (size / kilobyte).toFixed(2) + ' KB';
        } else if (size >= 0) {
          return size + ' B';
        }

        return 'N/A';
      },
    },

    methods: {
      compress: function (file) {
        if (!file) {
          return;
        }

        console.log('Compressing Input: ', file);

        if (URL) {
          this.inputURL = URL.createObjectURL(file);
          console.log('    inputURL=',this.inputURL);
        }

        this.input = file;
        new ImageCompressor(file, this.options);
      },

      change: function (e) {
        for(var i=0, len=e.target.files.length; i<len; i++) {
          console.log('File selected ', e.target.files[i]);
          this.compress(e.target.files[i]);
        }
      },

      dragover: function(e) {
        e.preventDefault();
      },

      drop: function(e) {
        e.preventDefault();
        for(var i=0, len=e.dataTransfer.files.length; i<len; i++) {
          console.log('File dropped ', e.dataTransfer.files[i]);
          this.compress(e.dataTransfer.files[i]);
        }
      },
    },
  });
});
