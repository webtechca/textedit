var moduleIndex = (function () {
  function ready() {
    var hash = window.location.hash;
    if (hash.trim() === '') {
      hash = '#replace';
    }
    $('a[href="' + hash + '"]').click();
  }

  function navigateTab() {
    $('.collection-item').removeClass('active');
    $(this).addClass('active');

    var id = $(this).attr('href');
    id = '#tab_' + id.replace('#', '');
    var $tab = $(id);
    if (!$tab.hasClass('active')) {
      $('.tab-content').removeClass('active');
      $tab.addClass('active');
    }
  }

  return {
    ready,
    navigateTab,
  };
})();

var moduleTextTransform = (function () {
  function handleChoice() {
    var $btn = $(this);
    var text = document.getElementById('transform_text').value;
    var operation = $btn.data('operation');
    printResult('transform', transformHandler(operation, text));
  }

  function handleReplaceAll() {
    var output = '';
    var text = $('#replace_string').val();
    var find = $('#replace_find').val();
    var replace = $('#replace_replace').val();
    output = text.replaceAll(find, replace);
    output = output.trim();

    $('#replace_result + label').addClass('active');
    document.getElementById('replace_result').textContent = output;
  }

  function handleReplicate() {
    var text = $('#replicate_text').val();
    var replications = [];
    var replication = {};
    var $inputs = $('input[id^=replicate_s]');
    var inputId = 0;
    for (var i = 0, l = $inputs.length; i < l; i++) {
      if ($inputs[i].value.trim() === '') {
        continue;
      }
      inputId = $inputs[i].id.substr(-1);
      replication = {
        s: $inputs[i].value.trim(),
        r: $('textarea[id^=replicate_r' + inputId + ']').val(),
      };
      replications.push(replication);
    }
    var output = replicate(text, replications);

    if ($('.js-replicate-include-initial').prop('checked')) {
      output = text + "\n" + output;
    }

    output = output.trim();
    document.getElementById('replicate_result').innerHTML = output;
  }

  function printResult(selectorName, content) {
    $('#' + selectorName + '_result + label').addClass('active');
    document.getElementById(selectorName + '_result').innerHTML = content;
  }

  function transformHandler(operation, text) {
    text = text.trim();
    var response = '';
    switch (operation) {
      case 'uppercase':
        response = text.toUpperCase();
        break;
      case 'lowercase':
        response = text.toLowerCase();
        break;
      case 'capitalize':
        response = ucfirst(text);
        break;
      case 'ucToCc':
        response = manyUcToCc(text);
        break;
      case 'sepToCc':
        response = manySepToCc(text);
        break;
      case 'dashToCs':
        response = manyDashToCs(text);
        break;
      case 'rmKeys':
        response = rmKeys(text);
        break;
      case 'rmValues':
        response = rmValues(text);
        break;
      case 'addValues':
        response = addValues(text);
        break;
      case 'sortTextAsc':
        response = sortTextAsc(text);
        break;
      case 'combine':
        // $commandes = $_POST['commandes'];
        // response = combine(text, $commandes);
        break;
      default:
        response = '';
        break;
    }
    response = response.replaceAll("\n", '<br />').trim();
    return response;
  }

  function sortTextAsc(text) {
    let textArray = text.split("\n");
    textArray.sort();
    return textArray.join("\n");
  }

  function ucfirst(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function lcfirst(text) {
    return text.charAt(0).toLowerCase() + text.slice(1);
  }

  function ucToCc(text) {
    if (text.indexOf('_') === false) {
      return text;
    }
    var string = text.split('_');
    var result = string[0];
    for (var i = 1, l = string.length; i < l; i++) {
      result += ucfirst(string[i]);
    }
    return result;
  }

  function manyUcToCc(text) {
    if (text.indexOf("\n") === false) {
      return ucToCc(text);
    }
    var singleTextList = text.split("\n");
    var newText = '';
    for (var i = 0, l = singleTextList.length; i < l; i++) {
      newText += ucToCc(singleTextList[i]) + "\n";
    }
    return newText.trim("\n");
  }

  function rmKeys(text) {
    var textArray = text.split("\n");
    var result = '';
    var separator = '=>';
    var separtorLength = separator.length;
    var separatorPosition;
    var textItem;
    for (var i = 0, l = textArray.length; i < l; i++) {
      textItem = textArray[i];
      separatorPosition = textItem.indexOf(separator);
      if (separatorPosition !== false) {
        separatorPosition += separtorLength;
        result += textItem.trim().substr(separatorPosition) + "\n";
      } else {
        result += textItem.trim() + "\n";
      }
    }

    return result.trimEnd("\n");
  }

  function addValues(text) {
    var textArray = text.split("\n");
    var result = '';
    for (var i = 0, l = textArray.length; i < l; i++) {
      result += textArray[i].trim().trimEnd(',') + " => '',\n";
    }

    return result.trimEnd("\n");
  }

  function rmValues(text) {
    var textArray = text.split("\n");
    var result = '';
    var separator = '=>';
    var separatorPosition;
    for (var i = 0, l = textArray.length; i < l; i++) {
      separatorPosition = textArray[i].indexOf(separator);
      if (separatorPosition !== false) {
        result += textArray[i].trim().substr(0, separatorPosition) + ",\n";
      }
    }

    return result.trimEnd("\n");
  }

  function replicate(text, replications) {
    var l = replications.length;
    var m = 0;
    var output = '';
    for (var i = 0; i < l; i++) {
      if (replications[i].s.trim() == '') {
        continue;
      }
      if (replications[i].r.indexOf("\n") > -1) {
        replications[i].r = replications[i].r.split("\n");
        m = replications[i].r.length;
        for (var j = 0; j < m; j++) {
          output += text.replace(replications[i].s, replications[i].r[j]) + "\n";
        }
      } else {
        output += text.replace(replications[i].s, replications[i].r) + "\n";
      }
    }
    return output;
  }

  function sepToCc(text) {
    var output = '';
    text = text.split('/');
    for (var i = 0, l = text.length; i < l; i++) {
      output += ucfirst(text[i]);
    }

    return lcfirst(output);
  }

  function manySepToCc(text) {
    var output = '';
    if (text.indexOf("\n") > -1) {
      text = text.split("\n");
      for (var i = 0, l = text.length; i < l; i++) {
        output += sepToCc(text[i]) + "\n";
      }
    } else {
      return sepToCc(text);
    }
    return output;
  }

  function manyDashToCs(text) {
    var output = '';
    if (text.indexOf("\n") > -1) {
      text = text.split("\n");
      for (var i = 0, l = text.length; i < l; i++) {
        output += dashToCs(text[i]) + "\n";
      }
    } else {
      return dashToCs(text);
    }
    return output;
  }

  function dashToCs(text) {
    output = text.replaceAll('-', ' ');
    return ucfirst(output);
  }


  return {
    handleChoice,
    handleReplaceAll,
    handleReplicate,
    ucfirst,
    manyUcToCc,
    manySepToCc,
    manyDashToCs,
    rmKeys,
    rmValues,
    addValues,
    replicate,
  };
})();


String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};


var moduleHelper = (function () {
  function isEmpty(param) {
    return (
      !param || 0 === param.length || param.trim().length === 0
    );
  }

  return {
    isEmpty,
  };
})();

var moduleApiHelper = (function () {
  function copyToClipboard() {
    var $result = $(this).closest('.card').find('.result-wrapper');
    var text = $result.text();
    $('.js-clipboard-text').val(text);
    $('.js-clipboard-text').select();
    document.execCommand("copy");
  }

  function handleGenerateRestfulRoutes() {
    var output = '';
    var text = $('#generate-restful_resource').val();
    var singularTag = text.replace(/s$/, '');
    var capitalisedText = moduleTextTransform.ucfirst(singularTag);
    output =
      `
    browse: ${text}      (GET)
    create: ${text}      (POST)
    read:   ${text}/{id} (GET)
    update: ${text}/{id} (PUT / PATCH)
    delete: ${text}/{id} (DELETE)

    $router->get('/${text}', '${capitalisedText}Controller@index');
    $router->get('/${text}/tree', '${capitalisedText}Controller@getTree');
    $router->get('/${text}/{id:\d+}', '${capitalisedText}Controller@show');
    $router->get('/${text}/search/{term}', '${capitalisedText}Controller@search');
    $router->addRoute(['PUT', 'PATCH'], '/${text}/{id:\d+}', '${capitalisedText}Controller@update');
    $router->put('/${text}/{id:\d+}', '${capitalisedText}Controller@update');
    $router->patch('/${text}/{id:\d+}', '${capitalisedText}Controller@update');
    $router->post('/${text}', '${capitalisedText}Controller@store');
    $router->delete('/${text}/{id:\d+}', '${capitalisedText}Controller@destroy');

    ------------------------------------------------

    public function index() {
      return $this->json(${capitalisedText}::all());
    }

    public function store($req) {
      $${singularTag} = new ${capitalisedText}();
      $defaultParent = 0;

      $new${capitalisedText} = $${singularTag}->create([
        'name' => $req['name'],
        'parent_id' => !empty($req['parentId']) ? $req['parentId'] : $defaultParent,
        'thumbnail' => !empty($req['thumbnail']) ? $req['thumbnail'] : '',
      ]);

      return $this->json($new${capitalisedText});
    }

    public function show($id) {
      return $this->json(${capitalisedText}::findOrFail($id));
    }

    public function search($term) {
      $${text} = ${capitalisedText}::where('name', 'like', "%$term%")
        ->get();

      return $this->json($${text});
    }

    public function destroy($id) {
      ${capitalisedText}::destroy($id);

      return $this->json([]);
    }

    public function update($req, $id) {
      $allowedFields = [
        'name' => 'name',
        'parent_id' => 'parentId',
        'thumbnail' => 'thumbnail',
      ];
      $params = [];
      foreach ($allowedFields as $key => $value) {
        if (isset($req[$value])) {
          $params[$key] = $req[$value];
        }
      }
      ${capitalisedText}::find($id)->update($params);

      return $this->json(${capitalisedText}::find($id));
    }
    `;
    output = output.trim();

    document.getElementById('generate-restful_result').innerHTML = output;
  }

  function handleGenerateSwaggerYaml() {
    var output = '';
    var tag = $('#generate-swagger_tag').val();
    var model = $('#generate-swagger_model').val();
    var singularTag = tag.replace(/s$/, '');
    var capitalisedTag = moduleTextTransform.ucfirst(tag);

    if (moduleHelper.isEmpty(model)) {
      model = ucfirst(singularTag);
    }
    output =
      `
    /${tag}:
      get:
        tags:
        - "${tag}"
        summary: "Find all ${tag}"
        description: "Returns all ${tag}"
        operationId: "get${capitalisedTag}"
        produces:
        - "application/xml"
        - "application/json"
        parameters: []
        responses:
          200:
            description: "successful operation"
            schema:
              $ref: "#/definitions/${model}"
        security:
        - api_key: []
      post:
        tags:
        - "${tag}"
        summary: "Add a new ${singularTag}"
        description: ""
        operationId: "add${model}"
        consumes:
        - "application/json"
        - "application/xml"
        produces:
        - "application/xml"
        - "application/json"
        parameters:
        - in: "body"
          name: "body"
          description: "${model} object that needs to be added"
          required: true
          schema:
            $ref: "#/definitions/${model}"
        responses:
          405:
            description: "Invalid input"
        security:
        - ${singularTag}_auth:
          - "write:${tag}"
          - "read:${tag}"
    /${tag}/{id}:
      get:
        tags:
        - "${tag}"
        summary: "Find ${singularTag} by ID"
        description: "Returns a single ${singularTag}"
        operationId: "get${model}ById"
        produces:
        - "application/xml"
        - "application/json"
        parameters:
        - name: "id"
          in: "path"
          description: "ID of ${singularTag} to return"
          required: true
          type: "integer"
          format: "int64"
        responses:
          200:
            description: "successful operation"
            schema:
              $ref: "#/definitions/${model}"
          400:
            description: "Invalid ID supplied"
          404:
            description: "${model} not found"
        security:
        - api_key: []
      put:
        tags:
        - "${tag}"
        summary: "Update an existing ${singularTag}"
        description: ""
        operationId: "update${model}"
        consumes:
        - "application/x-www-form-urlencoded"
        produces:
        - "application/xml"
        - "application/json"
        parameters:
        - name: "id"
          in: "path"
          description: "ID of ${singularTag} that needs to be updated"
          required: true
          type: "integer"
          format: "int64"
        - name: "date"
          in: "formData"
          description: "Updated date of the ${singularTag}"
          required: false
          type: "string"
          format: "date"
        - name: "liter"
          in: "formData"
          description: "Updated liters of the ${singularTag}"
          required: false
          type: "number"
          format: "float"
        - name: "price"
          in: "formData"
          description: "Updated price of the ${singularTag}"
          required: false
          type: "number"
          format: "float"
        - name: "distance"
          in: "formData"
          description: "Updated distance of the ${singularTag}"
          required: false
          type: "integer"
          format: "int64"
        responses:
          400:
            description: "Invalid ID supplied"
          404:
            description: "${model} not found"
          405:
            description: "Validation exception"
        security:
        - ${singularTag}_auth:
          - "write:${tag}"
          - "read:${tag}"
      delete:
        tags:
        - "${tag}"
        summary: "Deletes a ${singularTag}"
        description: ""
        operationId: "delete${model}"
        produces:
        - "application/xml"
        - "application/json"
        parameters:
        - name: "api_key"
          in: "header"
          required: false
          type: "string"
        - name: "id"
          in: "path"
          description: "${model} id to delete"
          required: true
          type: "integer"
          format: "int64"
        responses:
          400:
            description: "Invalid ID supplied"
          404:
            description: "${model} not found"
        security:
        - ${singularTag}_auth:
          - "write:${tag}"
          - "read:${tag}"
    `;
    output = output.trim();
    document.getElementById('generate-swagger_result').innerHTML = output;
  }

  function handleGenerateJsApi() {
    var output = '';
    var resource = $('#generate-js-api_resource').val();
    var routes = $('#generate-js-api_routes').val();

    var singularText = resource.replace(/s$/, '');
    var capitalisedText = moduleTextTransform.ucfirst(singularText);
    output =
      `
    var module${capitalisedText}Api = (function () {
      const baseUrl = 'http://example.site/';

      function getAll(callback) {
        let endpoint = '${resource}';
        return $.get(baseUrl + endpoint, callback, 'json');
      }

      function get(callback, id) {
        let endpoint = '${resource}/' + id;
        return $.get(baseUrl + endpoint, callback, 'json');
      }

      function update(callback, id, params) {
        let endpoint = '${resource}/' + id;
        return $.post(baseUrl + endpoint, params, callback, 'json');
      }
      function update(callback, id, params) {
        let endpoint = '${resource}/' + id;
        return $.ajax({
          url: baseUrl + endpoint,
          type: 'PUT',
          data: params,
          success: callback,
          dataType: 'json',
        });
      }

      function create(callback, params) {
        let endpoint = '${resource}';
        return $.post(baseUrl + endpoint, params, callback, 'json');
      }

      function destroy(callback, id) {
        let endpoint = '${resource}/' + id;
        return $.ajax({
          url: baseUrl + endpoint,
          type: 'DELETE',
          success: callback,
          dataType: 'json',
        });
      }

      function search(callback, term) {
        let endpoint = '${resource}/search/' + term;
        return $.get(baseUrl + endpoint, callback, 'json');
      }

      return {
        getAll,
        get,
        update,
        create,
        destroy,
        search,
      };
    })();

    // ------------------------------------------------------------------

    var module${capitalisedText}Api = (function () {
      const baseUrl = 'http://example.site/';
      // api_key is a global varialble containing the api_key
      const authentication = '?api_key=' + api_key;

      function getAll(callback) {
        let endpoint = '${resource}';
        let url = baseUrl + endpoint + authentication;
        return $.get(url, callback, 'json');
      }

      function get(callback, id) {
        let endpoint = '${resource}/' + id;
        let url = baseUrl + endpoint + authentication;
        return $.get(url, callback, 'json');
      }

      function update(callback, id, params) {
        let endpoint = '${resource}/' + id;
        let url = baseUrl + endpoint + authentication;
        return $.post(url, params, callback, 'json');
      }
      function update(callback, id, params) {
        let endpoint = '${resource}/' + id;
        let url = baseUrl + endpoint + authentication;
        return $.ajax({
          url: url,
          type: 'PUT',
          data: params,
          success: callback,
          dataType: 'json',
        });
      }

      function create(callback, params) {
        let endpoint = '${resource}';
        let url = baseUrl + endpoint + authentication;
        return $.post(url, params, callback, 'json');
      }

      function destroy(callback, id) {
        let endpoint = '${resource}/' + id;
        let url = baseUrl + endpoint + authentication;
        return $.ajax({
          url: url,
          type: 'DELETE',
          success: callback,
          dataType: 'json',
        });
      }

      function search(callback, term) {
        let endpoint = '${resource}/search/' + term;
        let url = baseUrl + endpoint + authentication;
        return $.get(url, callback, 'json');
      }

      return {
        getAll,
        get,
        update,
        create,
        destroy,
        search,
      };
    })();
    `;

    $('.js-js-api-result').text(output);
  }

  return {
    copyToClipboard,
    handleGenerateRestfulRoutes,
    handleGenerateSwaggerYaml,
    handleGenerateJsApi,
  };
})();

var moduleApacheConfig = (function () {
  function handleGenerateConfigs() {
    let output = '';
    let outputFiles = '';
    let outputSsl = '';
    let domain = $('#generate-apache_domain').val();
    let isSslEnabled = $('.apache-ssl-check').prop('checked');
    let outputRedirect = '';

    outputFiles = `
vim ${domain}.conf
vim ${domain}-le-ssl.conf
a2ensite ${domain}-le-ssl.conf
`;

    if (isSslEnabled) {
      outputRedirect = `
        RewriteEngine on
        RewriteCond %{SERVER_NAME} =${domain}.webnest.site
        RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]`;
    }

    output = `
<VirtualHost *:80>
        # The ServerName directive sets the request scheme, hostname and port that
        # the server uses to identify itself. This is used when creating
        # redirection URLs. In the context of virtual hosts, the ServerName
        # specifies what hostname must appear in the request's Host: header to
        # match this virtual host. For the default virtual host (this file) this
        # value is not decisive as it is used as a last resort host regardless.
        # However, you must set it for any further virtual host explicitly.

        ServerName ${domain}.webnest.site

        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/${domain}

        # Available loglevels: trace8, ..., trace1, debug, info, notice, warn,
        # error, crit, alert, emerg.
        # It is also possible to configure the loglevel for particular
        # modules, e.g.
        #LogLevel info ssl:warn

        ErrorLog \${APACHE_LOG_DIR}/error.log
        CustomLog \${APACHE_LOG_DIR}/access.log combined

        # For most configuration files from conf-available/, which are
        # enabled or disabled at a global level, it is possible to
        # include a line for only one particular virtual host. For example the
        # following line enables the CGI configuration for this host only
        # after it has been globally disabled with "a2disconf".
        #Include conf-available/serve-cgi-bin.conf
        ${outputRedirect}
</VirtualHost>
<Directory /var/www/${domain}>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
</Directory>`;

    outputSsl = `
<IfModule mod_ssl.c>
<VirtualHost *:443>
        # The ServerName directive sets the request scheme, hostname and port that
        # the server uses to identify itself. This is used when creating
        # redirection URLs. In the context of virtual hosts, the ServerName
        # specifies what hostname must appear in the request's Host: header to
        # match this virtual host. For the default virtual host (this file) this
        # value is not decisive as it is used as a last resort host regardless.
        # However, you must set it for any further virtual host explicitly.

        ServerName ${domain}.webnest.site

        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/${domain}

        # Available loglevels: trace8, ..., trace1, debug, info, notice, warn,
        # error, crit, alert, emerg.
        # It is also possible to configure the loglevel for particular
        # modules, e.g.
        #LogLevel info ssl:warn

        ErrorLog \${APACHE_LOG_DIR}/error.log
        CustomLog \${APACHE_LOG_DIR}/access.log combined

        # For most configuration files from conf-available/, which are
        # enabled or disabled at a global level, it is possible to
        # include a line for only one particular virtual host. For example the
        # following line enables the CGI configuration for this host only
        # after it has been globally disabled with "a2disconf".
        #Include conf-available/serve-cgi-bin.conf

        SSLCertificateFile /etc/letsencrypt/live/${domain}.webnest.site/fullchain.pem
        SSLCertificateKeyFile /etc/letsencrypt/live/${domain}.webnest.site/privkey.pem
        Include /etc/letsencrypt/options-ssl-apache.conf
</VirtualHost>
</IfModule>`;

    // trim is messing up indentation, so don't trim() mindlessly
    $('.js-apache-files-result').text(outputFiles.trim());
    $('.js-apache-result').text(output.trim());
    $('.js-apache-ssl-result').text(outputSsl.trim());
  }

  return {
    handleGenerateConfigs,
  };
})();

var moduleJwt = (function () {
  function handleGenerateToken() {
    let output = '';
    let data = $('#generate-jwt_data').val().trim();
    let secret = $('#generate-jwt_secret').val().trim();
    data = JSON.parse(data);

    let header = {
      "alg": "HS256",
      "typ": "JWT"
    };

    let stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    let encodedHeader = base64url(stringifiedHeader);
    output += encodedHeader;

    let stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    // let stringifiedData = CryptoJS.enc.Utf8.parse(data);
    let encodedData = base64url(stringifiedData);
    output += '.' + encodedData;

    let signature = encodedHeader + "." + encodedData;
    signature = CryptoJS.HmacSHA256(signature, secret);
    signature = base64url(signature);
    output += '.' + signature;

    $('.js-jwt-result').text(output);
  }


  function base64url(source) {
    // Encode in classical base64
    encodedSource = CryptoJS.enc.Base64.stringify(source);

    // Remove padding equal characters
    encodedSource = encodedSource.replace(/=+$/, '');

    // Replace characters according to base64url specifications
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');

    return encodedSource;
  }


  return {
    handleGenerateToken,
  };
})();

var modulePhpClass = (function () {
  function handleGenerateClass() {
    let output = '';
    output = printClass(fetchClass());
    $('.js-phpclass-result').text(output);
  }

  function handleAddProperty() {
    let name = $('.js-phpclass-property').val().trim();
    let visibility = $('.js-phpclass-select-visibility').val();
    let type = $('.js-phpclass-select-type').val();
    let output =
      `
    <div class="row">
      <div class="col s3 js-phpclass-property-name">${name}</div>
      <div class="col s3 js-phpclass-property-visibility">${visibility}</div>
      <div class="col s3 js-phpclass-property-type">${type}</div>
      <div class="col s3">
        <button type="button" class="waves-effect waves-light btn js-btn-phpclass-remove-property">Remove</button>
      </div>
    </div>
    `;
    $('.js-phpclass-properties').append(output.trim());
    $('.js-phpclass-property').val('');
  }

  function handleRemoveProperty() {
    if (!confirm('Are you sure?')) {
      return false;
    }
    let $property = $(this).closest('.row');
    $property.fadeOut('slow');
    setTimeout(() => {
      $property.remove();
    }, 300);
  }

  function fetchClass() {
    let classObject = {};
    let name = $('#generate-phpclass_class').val().trim();
    let extendedClasses = $('#generate-phpclass_extends').val().trim();
    let implementedClasses = $('#generate-phpclass_implements').val().trim();

    name = moduleTextTransform.ucfirst(name);

    if (extendedClasses === '') {
      extendedClasses = '';
    } else if (extendedClasses.indexOf(',') > -1) {
      let extendedClassesArray = extendedClasses.split(',');
      // take the first one
      extendedClasses = extendedClassesArray[0];
    } else {
      extendedClasses = moduleTextTransform.ucfirst(extendedClasses);
    }
    // if (extendedClasses !== '') {
    //   extendedClasses = 'extends ' + moduleTextTransform.ucfirst(extendedClasses);
    // }

    if (implementedClasses === '') {
      implementedClasses = [];
    } else if (implementedClasses.indexOf(',') > -1) {
      let implementedClassesArray = implementedClasses.split(',');
      implementedClasses = [];
      for (let i = 0, l = implementedClassesArray.length; i < l; i++) {
        implementedClasses.push(moduleTextTransform.ucfirst(implementedClassesArray[i].trim()));
      }
    } else {
      implementedClasses = [moduleTextTransform.ucfirst(implementedClasses)];
    }
    // if (implementedClasses !== '') {
    //   implementedClasses = 'implements ' + moduleTextTransform.ucfirst(implementedClasses);
    // }
    let classProperties = [];
    let $property = null;
    let properties = $('.js-phpclass-properties > .row');
    for (let i = 0, l = properties.length; i < l; i++) {
      $property = $(properties[i]);
      classProperties.push({
        name: $property.find('.js-phpclass-property-name').text().trim(),
        visibility: $property.find('.js-phpclass-property-visibility').text().trim(),
        type: $property.find('.js-phpclass-property-type').text().trim(),
      });
    }

    classObject = {
      name: name,
      extends: extendedClasses,
      implements: implementedClasses,
      properties: classProperties,
    };

    return classObject;
  }

  function printClass(classObject) {
    let output = '';
    // output = JSON.stringify(classObject, null, 2);
    let definition = classObject.name;
    if (classObject.extends.length > 0) {
      definition += ' extends ' + classObject.extends;
    }
    let implementedClassesLength = classObject.implements.length;
    let implementedClasses = '';
    if (implementedClassesLength > 0) {
      implementedClasses = classObject.implements.join(', ');
      // for (let i = 0; i < implementedClassesLength; i++) {
      //   implementedClasses += classObject.implements[i];
      // }
      definition += ' implements ' + implementedClasses;
    }

    let properties = '';
    let methods = '';
    let property = {};
    let capitalisedText = '';
    for (let i = 0, l = classObject.properties.length; i < l; i++) {
      property = classObject.properties[i];
      properties +=
        `
      /**
       *
       * @var ${property.type}
       */
      ${property.visibility} $${property.name};
      `;

      capitalisedText = moduleTextTransform.ucfirst(property.name);
      methods +=
        `
      public function get${capitalisedText}(): ?${property.type} {
        return $this->${property.name};
      }

      public function set${capitalisedText}(${property.type} $${property.name}): self {
        $this->${property.name} = $${property.name};

        return $this;
      }
      `;
    }
    properties = properties.trim();
    methods = methods.trim();

    output =
      `
    class ${definition} {
      ${properties}

      public function __construct() {
      }

      ${methods}
    }
    `;

    return output.trim();
  }

  return {
    handleAddProperty,
    handleRemoveProperty,
    handleGenerateClass,
  };
})();

var moduleBeautify = (function () {
  function handleBeautify() {
    let text = $('.js-beautify-text').val();
    let choice = $(this).data('operation');
    let output = '';
    if (choice === 'json') {
      output = JSON.parse(text);
      output = JSON.stringify(output, null, 2);
    } else {
      output = text;
    }
    $('.js-beautify-result').text(output);
  }

  return {
    handleBeautify,
  };
})();

var moduleTransformColornarnia = (function () {
  function handleTransformColornarnia() {
    let text = $('.js-transform-colornarnia-text').val();
    let transformedText = text.replace(/\\/g, '/')
      .replace(/ /g, '%20')
      .slice(2);
    let output = `![AltText](../../../..${transformedText} "${text}")`;

    $('.js-transform-colornarnia-result').text(output);
  }

  return {
    handleTransformColornarnia,
  };
})();

var moduleDuplicateChecker = (function () {
  function handleProcess() {
    let text = $('.js-duplicate-checker-text').val();
    let singleQuote = $('.js-duplicate-checker-quote').prop('checked');
    let output = '';
    let textArray = text.split("\n");
    let dataArray = [];
    let processedText = '';
    let hasDuplicate = false;
    let duplicateData = [];

    for (var i = 0, l = textArray.length; i < l; i++) {
      if (textArray[i].trim() === '') {
        continue;
      }
      processedText = extractFirstText(textArray[i], singleQuote);
      // processedText = textArray[i];
      if (dataArray.indexOf(processedText) > -1) {
        hasDuplicate = true;
        duplicateData.push(processedText);
      } else {
        dataArray.push(processedText);
      }
    }
    output += 'Has Duplicate: ' + (hasDuplicate ? 'YES' : 'NO');
    output += "\n";
    output += duplicateData.join("\n");

    $('.js-duplicate-checker-result').text(output);
  }

  function extractFirstText(str, singleQuote) {
    const matches = singleQuote ? str.match(/'(.*?)'/) : str.match(/"(.*?)"/);
    return matches
      ? matches[1]
      : str;
  }

  function extractAllText(str, singleQuote) {
    const re = singleQuote ? /'(.*?)'/g : /"(.*?)"/g;
    const result = [];
    let current;
    while (current = re.exec(str)) {
      result.push(current.pop());
    }
    return result.length > 0
      ? result
      : [str];
  }

  return {
    handleProcess,
  };
})();

var moduleExtractDomains = (function () {
  function handleProcess() {
    // let text = $('.js-extract-domains-text').val();
    let output = '';

    // Example input string
    const inputString = $('.js-extract-domains-text').val();
    // const inputString = "Check out this website: https://www.example.com and this one: http://subdomain.example.com/path. Also, don't forget about https://www.another-example.com!";

    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Extract all URLs from input string
    const urls = inputString.match(urlRegex);

    if (urls === null || urls === undefined) {
      $('.js-extract-domains-result').text(output);
      return;
    }

    // Extract unique domain names from URLs
    const uniqueDomains = [...new Set(urls.map(url => new URL(url).hostname))];

    output = uniqueDomains.join("\n");


    $('.js-extract-domains-result').text(output);
  }

  return {
    handleProcess,
  };
})();

var moduleGameJam = (function () {
  function handleRandomize() {
    const leads = ['Male', 'Female'];
    const leads2 = ['Shibi', 'Normal'];
    const leads3 = ['Walk', 'Run'];
    const genres = ['Platformer', 'Topdown', 'Fighting'];
    const genres2 = ['Real-time Action', 'Turn-based'];
    const genres3 = ['Fighting', 'Puzzle', 'Racing', 'Tactical'];
    const settings = ['Distant Future', 'World War'];
    const platforms = ['Mobile', 'Pc'];

    let lead = leads[Math.floor(Math.random() * leads.length)];
    let lead2 = leads2[Math.floor(Math.random() * leads2.length)];
    let lead3 = leads3[Math.floor(Math.random() * leads3.length)];
    let genre = genres[Math.floor(Math.random() * genres.length)];
    let genre2 = genres2[Math.floor(Math.random() * genres2.length)];
    let genre3 = genres3[Math.floor(Math.random() * genres3.length)];
    let platform = platforms[Math.floor(Math.random() * platforms.length)];
    let setting = settings[Math.floor(Math.random() * settings.length)];

    $('#generate-gamejam_lead').val(lead);
    $('#generate-gamejam_lead2').val(lead2);
    $('#generate-gamejam_lead3').val(lead3);
    $('#generate-gamejam_genre').val(genre);
    $('#generate-gamejam_genre2').val(genre2);
    $('#generate-gamejam_genre3').val(genre3);
    $('#generate-gamejam_platform').val(platform);
    $('#generate-gamejam_setting').val(setting);
  }

  return {
    handleRandomize,
  };
})();

$(document)
  .ready(moduleIndex.ready)
  .ready(moduleGameJam.handleRandomize)
  // clicks
  .on('click', '.collection-item', moduleIndex.navigateTab)
  .on('click', '.btn-transform-text', moduleTextTransform.handleChoice)
  .on('click', '#btn_replace', moduleTextTransform.handleReplaceAll)
  .on('click', '#btn_replicate', moduleTextTransform.handleReplicate)
  .on('click', '.js-btn-copy-to-clipboard', moduleApiHelper.copyToClipboard)
  .on('click', '#btn_generate-restful', moduleApiHelper.handleGenerateRestfulRoutes)
  .on('click', '.js-btn-generate-js-api', moduleApiHelper.handleGenerateJsApi)
  .on('click', '.js-btn-generate-apache', moduleApacheConfig.handleGenerateConfigs)
  .on('click', '.js-btn-generate-jwt', moduleJwt.handleGenerateToken)
  .on('click', '.js-btn-add-phpclass-property', modulePhpClass.handleAddProperty)
  .on('click', '.js-btn-phpclass-remove-property', modulePhpClass.handleRemoveProperty)
  .on('click', '.js-btn-generate-phpclass', modulePhpClass.handleGenerateClass)
  .on('click', '.js-btn-beautify', moduleBeautify.handleBeautify)
  .on('click', '.js-btn-transform-colornarnia', moduleTransformColornarnia.handleTransformColornarnia)
  .on('click', '.js-btn-process-duplicate', moduleDuplicateChecker.handleProcess)
  .on('click', '.js-btn-process-extract-domains', moduleExtractDomains.handleProcess)
  .on('click', '.js-btn-generate-gamejam', moduleGameJam.handleRandomize)
  .on('click', '#btn_generate-swagger', moduleApiHelper.handleGenerateSwaggerYaml)
  // inputs
  .on('input', '.js-transform-colornarnia-text', moduleTransformColornarnia.handleTransformColornarnia)
  ;
