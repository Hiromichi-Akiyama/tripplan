class User < ApplicationRecord
  DEMO_TTL = 6.hours

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :trips, dependent: :destroy

  # Password policy
  # - Devise handles: required + length (config.password_length)
  # - Here we enforce: includes at least 1 letter and 1 digit
  PASSWORD_COMPLEXITY_REGEX = /\A(?=.*[A-Za-z])(?=.*\d).+\z/

  validates :password,
            format: {
              with: PASSWORD_COMPLEXITY_REGEX,
              message: "は英字を1文字以上、数字を1文字以上含めてください"
            },
            if: -> {
              password_required? && password.present? && password.length >= Devise.password_length.min
            }

  def demo?
    demo
  end

  # Profile update policy
  # Prefer Devise's update_without_password when available (e.g., updating name/email from a profile screen)
  # so users are not forced to re-enter their password.
  def update_profile(attrs)
    if respond_to?(:update_without_password)
      update_without_password(attrs)
    else
      update(attrs)
    end
  end

  scope :expired_demos, -> {
    where(demo: true)
      .where("demo_expires_at IS NOT NULL AND demo_expires_at < ?", Time.current)
  }

  scope :active_demos, -> {
    where(demo: true)
      .where("demo_expires_at IS NOT NULL AND demo_expires_at >= ?", Time.current)
  }
end
