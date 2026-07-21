Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  get "/api/health", to: "health#index"

  namespace :api do
    resources :tasks
  end
end
