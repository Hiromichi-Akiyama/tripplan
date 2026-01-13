module Users
  class SessionsController < Devise::SessionsController
    def destroy
      demo_user_id = session[:demo_user_id]
      demo_user = current_user if demo_user_id.present? && current_user&.id == demo_user_id.to_i

      super

      if demo_user
        demo_user.destroy!
        session.delete(:demo_user_id)
      end
    end
  end
end
