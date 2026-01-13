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

  scope :expired_demos, -> {
    where(demo: true)
      .where("demo_expires_at IS NOT NULL AND demo_expires_at < ?", Time.current)
  }

  scope :active_demos, -> {
    where(demo: true)
      .where("demo_expires_at IS NOT NULL AND demo_expires_at >= ?", Time.current)
  }
end
