let baseUrl = CONFIG.API_ENDPOINT;

class _FlipkartApi {
  constructor() {
    this.config = {};
  }
  fetchImpl(path, config, fetchCb) {
    return fetch(path, config)
      .then(response => {
        const contentType = response.headers.get("Content-Type");
        if (contentType.indexOf("application/json") >= 0) {
          return response.json()
            .then(data => {
              return { data: data, response: response };
            })
        } else {
          return response.text()
            .then(data => {
              return { data: data, response: response };
            })
        }
      }, error => {
        throw new Error("Please connect to internet and try again. for", path)
      })
      .then(({ data, response }) => {
        //for 200
        if (response.ok) {
          if (fetchCb) {
            return fetchCb(null, data);
          }
          return data;
        }
        //clearly identify exact type of error(Server[4XXX], API)
        if (fetchCb) {
          return fetchCb(true, { errorMessage: "Something went wrong!" })
        }
      })
    // .catch(error => {
    //   if (fetchCb) {
    //     return fetchCb(true, { errorMessage: error.message.toSt })
    //   }
    // })

  }
  callRestApi(method, endPoint, paramsOrCb, cb) {
    const config = this.config;
    const params = (paramsOrCb && !(typeof paramsOrCb === "function"))
      ? paramsOrCb : null;
    const callback = (paramsOrCb && (typeof paramsOrCb === "function")) ? paramsOrCb : cb;
    config.method = method;

    if (params) {
      if (parmas.isFormData) {
        config.body = parmas.data;
      } else {
        config.body = JSON.stringify(params);
        config.headers["Content-Type"] = "application/json; charset=UTF-8";
      }
    }
    return this.fetchImpl(baseUrl + endPoint, config, callback);
  }

  get(endpoint, paramsOrCb, cb) {
    return this.callRestApi("GET", endpoint, paramsOrCb, cb);
  }

  post(endpoint, paramsOrCb, cb) {
    return this.callRestApi("POST", endpoint, paramsOrCb, cb);
  }
}

var FlipkartApi = () => new _FlipkartApi();