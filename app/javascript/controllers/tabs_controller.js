import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["tab", "panel"]

  connect() {
    this.activate(this.initialTabId(), false)
  }

  switch(event) {
    event.preventDefault()
    const id = event.params.id || event.currentTarget.dataset.tabId
    this.activate(id, true)
  }

  activate(id, updateHash) {
    if (!id) return

    this.tabTargets.forEach((tab) => {
      const active = tab.dataset.tabId === id
      tab.setAttribute("aria-selected", active ? "true" : "false")
      tab.setAttribute("tabindex", active ? "0" : "-1")
      const activeStyle = tab.dataset.tabsActiveStyle
      const inactiveStyle = tab.dataset.tabsInactiveStyle
      if (activeStyle && inactiveStyle) {
        tab.style.cssText = active ? activeStyle : inactiveStyle
      }
    })

    this.panelTargets.forEach((panel) => {
      const active = panel.dataset.tabId === id
      panel.hidden = !active
      panel.setAttribute("aria-hidden", active ? "false" : "true")
    })

    if (updateHash) {
      history.replaceState(null, "", `#${id}`)
    }
  }

  initialTabId() {
    const hash = window.location.hash.replace("#", "")
    if (hash && this.panelTargets.some((panel) => panel.dataset.tabId === hash)) {
      return hash
    }
    return this.element.dataset.tabsDefault || this.tabTargets[0]?.dataset.tabId
  }
}
