Rails.application.routes.draw do
  devise_for :users

  resources :trips, only: [:index, :show]
  # 将来的にonlyは外す予定
end
