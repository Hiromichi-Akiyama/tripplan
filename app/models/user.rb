class User < ApplicationRecord
  DEMO_TTL = 6.hours

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :trips, dependent: :destroy

  # Password policy
  # - required
  # - 8+ characters
  # - includes at least 1 letter and 1 digit
  PASSWORD_POLICY_REGEX = /\A(?=.*[A-Za-z])(?=.*\d).{8,}\z/

  validates :password,
            presence: true,
            length: { minimum: 8 },
            format: {
              with: PASSWORD_POLICY_REGEX,
              message: "は8文字以上で、英字を1文字以上、数字を1文字以上含めてください"
            },
            if: :password_required?

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
