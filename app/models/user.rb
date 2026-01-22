class User < ApplicationRecord
  DEMO_TTL = 6.hours

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :trips, dependent: :destroy

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
