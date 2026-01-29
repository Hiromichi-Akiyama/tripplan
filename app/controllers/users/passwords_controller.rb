class Users::PasswordsController < Devise::PasswordsController
  def create
    email = resource_params[:email].to_s.strip

    if email.present? && !email.match?(URI::MailTo::EMAIL_REGEXP)
      self.resource = resource_class.new(email: email)
      resource.errors.add(:email, :invalid)
      respond_with(resource, status: :unprocessable_entity)
    else
      super
    end
  end
end
