module Users
  class SessionsController < Devise::SessionsController
    def destroy
      demo_user_id = session[:demo_user_id]

      if demo_user_id.present?
        if current_user.present? && current_user.id == demo_user_id.to_i
          demo_user = current_user
        end
      end

      super

      if demo_user
        demo_user.destroy!
        session.delete(:demo_user_id)
      end
    end
  end
end
