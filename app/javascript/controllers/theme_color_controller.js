import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "radio",
    "swatch",
    "customRadio",
    "customSwatch",
    "picker",
    "previewBar"
  ]

  connect() {
    this.applyColor(this.currentColor())
  }

  select(event) {
    this.applyColor(event.target.value)
  }

  openPicker() {
    if (this.hasPickerTarget) {
      this.pickerTarget.click()
    }
  }

  customChange(event) {
    const color = event.target.value
    if (this.hasCustomRadioTarget) {
      this.customRadioTarget.value = color
      this.customRadioTarget.checked = true
    }
    this.applyColor(color)
  }

  applyColor(color) {
    if (!color) return

    let matched = false
    let matchedRadio = null
    this.swatchTargets.forEach((swatch) => {
      const isMatch = swatch.dataset.color === color
      if (isMatch) matched = true
      swatch.classList.toggle("is-selected", isMatch)
    })

    this.radioTargets.forEach((radio) => {
      if (radio.value === color && radio !== this.customRadioTarget) {
        matchedRadio = radio
      }
    })

    if (this.hasCustomSwatchTarget) {
      this.customSwatchTarget.style.background = color
      const customSelected = !matched
      this.customSwatchTarget.classList.toggle("is-selected", customSelected)
      if (this.hasCustomRadioTarget) {
        this.customRadioTarget.value = color
        this.customRadioTarget.checked = customSelected
      }
    }

    if (matchedRadio) {
      matchedRadio.checked = true
    }

    if (this.hasPickerTarget) {
      this.pickerTarget.value = color
    }

    if (this.hasPreviewBarTarget) {
      this.previewBarTarget.style.background = `linear-gradient(135deg, ${color} 0%, #f3f4f6 100%)`
    }
  }

  currentColor() {
    const checked = this.radioTargets.find((radio) => radio.checked)
    return checked ? checked.value : this.pickerTarget?.value
  }
}
