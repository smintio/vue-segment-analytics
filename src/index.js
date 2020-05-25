import init from './init'

/**
 * Vue installer
 * @param  {Vue instance} Vue
 * @param  {Object} [options={}]
 */
function install (Vue, options = {}) {
  const config = Object.assign({
    debug: false,
    pageCategory: '',
  }, options)

  let analytics = init(config, () => {})
  
  // Page tracking
  if (config.router !== undefined) {
    config.router.afterEach((to, from) => {
      // Make a page call for each navigation event
      var properties = {
        path: to.fullPath,
        referrer: from.fullPath
      };

      if (window.smintIoPluginScope !== undefined &&
          window.smintIoPluginScope) {
        properties.pluginScope = window.smintIoPluginScope;
      }

      window.analytics.page(config.pageCategory, to.name || '', properties);
    })
  }

  // Setup instance access
  Object.defineProperty(Vue, '$segment', {
    get () { return window.analytics }
  })
  Object.defineProperty(Vue.prototype, '$segment', {
    get () { return window.analytics }
  })
}

export default { install }
