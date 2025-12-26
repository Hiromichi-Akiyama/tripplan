Rails.application.routes.draw do
  devise_for :users

  resources :trips, only: %i[index show new create edit update destroy] do
    resources :activities, only: %i[new create edit update destroy] # index/showは不要
    resources :packing_items, only: %i[new create edit update destroy]
  end
end
