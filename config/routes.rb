Rails.application.routes.draw do
  devise_for :users, controllers: { passwords: "users/passwords" }
  root "pages#home"
  resource :profile, only: %i[edit update]

  resources :trips, only: %i[index show new create edit update destroy] do
    resources :activities, only: %i[show new create edit update destroy]
    resources :packing_items, only: %i[new create update destroy]
  end
end
