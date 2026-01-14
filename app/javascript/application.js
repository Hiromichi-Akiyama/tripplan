// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import { Turbo } from "@hotwired/turbo-rails"
import { application } from "controllers/application"
import "controllers"

Turbo.setConfirmMethod((message) => {
  const modalElement = document.querySelector("[data-controller~='confirm-modal']")
  if (!modalElement) {
    return Promise.resolve(window.confirm(message))
  }

  const controller = application.getControllerForElementAndIdentifier(
    modalElement,
    "confirm-modal"
  )
  if (!controller) {
    return Promise.resolve(window.confirm(message))
  }

  return controller.open({ message })
})
