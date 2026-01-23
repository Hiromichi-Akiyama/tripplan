import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["overlay", "message"]

  connect() {
    this.resolver = null
    this.handleKeydown = this.handleKeydown.bind(this)
  }

  open({ message }) {
    this.messageTarget.textContent = message
    this.overlayTarget.hidden = false
    document.addEventListener("keydown", this.handleKeydown)

    return new Promise((resolve) => {
      this.resolver = resolve
    })
  }

  cancel() {
    this.close(false)
  }

  confirm() {
    this.close(true)
  }

  closeOnOverlay(event) {
    if (event.target === this.overlayTarget) {
      this.close(false)
    }
  }

  handleKeydown(event) {
    if (event.key === "Escape") {
      this.close(false)
    }
  }

  close(result) {
    if (this.resolver) {
      this.resolver(result)
      this.resolver = null
    }
    this.overlayTarget.hidden = true
    document.removeEventListener("keydown", this.handleKeydown)
  }
}
