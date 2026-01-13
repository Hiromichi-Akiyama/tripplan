class ApplicationController < ActionController::Base
  helper_method :demo_user?

  def demo_user?
    session[:demo_user_id].present? && current_user&.id == session[:demo_user_id].to_i
  end
end
