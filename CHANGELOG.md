## v2.0.1

* Upgrade to BP-Core-Api v4 (v3 is going to deprecate soon)
* Add event `code-expired` - Trigger when SessionCode expired

## v2.0

* Using Long pooling api
* Simplify constructor (only need `env` and `clientId`)
  Where `env`:
  * `staging`: Testing env
  * `prod`: Production env

## v1.0

* Support basic features:
  * Create SessionCode
  * SessionCode life-circle init -> loading -> complete
