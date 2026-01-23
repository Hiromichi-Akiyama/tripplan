import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["root", "panel", "backdrop"]
  static values = { open: Boolean }

  connect() {
    this.handleKeydown = this.handleKeydown.bind(this)
    this.syncState()
  }

  disconnect() {
    this.removeKeydownListener()
    document.body.style.overflow = ""
  }

  open() {
    if (this.openValue) return
    this.openValue = true
    this.syncState()
  }

  close() {
    if (!this.openValue) return
    this.openValue = false
    this.syncState()
  }

  handleKeydown(event) {
    if (event.key === "Escape") {
      this.close()
    }
  }

  syncState() {
    this.rootTarget.classList.toggle("is-open", this.openValue)
    this.rootTarget.setAttribute("aria-hidden", this.openValue ? "false" : "true")

    if (this.openValue) {
      document.body.style.overflow = "hidden"
      this.addKeydownListener()
    } else {
      document.body.style.overflow = ""
      this.removeKeydownListener()
    }
  }

  addKeydownListener() {
    document.addEventListener("keydown", this.handleKeydown)
  }

  removeKeydownListener() {
    document.removeEventListener("keydown", this.handleKeydown)
  }
}
