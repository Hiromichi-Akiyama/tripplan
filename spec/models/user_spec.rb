require 'rails_helper'

RSpec.describe User, type: :model do
  before do
    @user = FactoryBot.build(:user)
  end

  describe 'ユーザー新規登録' do
    
    context '新規登録できるとき' do
      it 'email, password, password_confirmationが存在すれば登録できる' do
        expect(@user).to be_valid
      end
    end

    context '新規登録できないとき' do
      it 'emailが空では登録できない' do
        @user.email = ''
        @user.valid?
        expect(@user.errors.full_messages).to include("メールアドレスを入力してください")
      end

      it 'passwordが空では登録できない' do
        @user.password = ''
        @user.valid?
        expect(@user.errors.full_messages).to include("パスワードを入力してください")
      end

      it 'passwordとpassword_confirmationが不一致では登録できない' do
        @user.password = 'abc12345'
        @user.password_confirmation = 'abc123456'
        @user.valid?
        expect(@user.errors.full_messages).to include("パスワード（確認）とパスワードの入力が一致しません")
      end

      it '重複したemailが存在する場合は登録できない' do
        @user.save
        another_user = FactoryBot.build(:user)
        another_user.email = @user.email
        another_user.valid?
        expect(another_user.errors.full_messages).to include("メールアドレスはすでに使用されています")
      end

      it 'emailは@を含まないと登録できない' do
        @user.email = 'testemail.com'
        @user.valid?
        expect(@user.errors.full_messages).to include("メールアドレスは不正な値です")
      end

      it 'passwordが数字のみでは登録できない' do
        @user.password = '12345678'
        @user.password_confirmation = '12345678'
        @user.valid?
        expect(@user.errors.full_messages).to include("パスワードは英字を1文字以上、数字を1文字以上含めてください")
      end

      it 'passwordが英字のみでは登録できない' do
        @user.password = 'abcdefgh'
        @user.password_confirmation = 'abcdefgh'
        @user.valid?
        expect(@user.errors.full_messages).to include("パスワードは英字を1文字以上、数字を1文字以上含めてください")
      end

      it 'passwordが11文字以下では登録できない' do
        @user.password = 'abc12345678'
        @user.password_confirmation = 'abc12345678'
        @user.valid?
        expect(@user.errors.full_messages).to include("パスワードは12文字以上で入力してください")
      end

      it 'passwordが129文字以上では登録できない' do
        @user.password = 'a' * 129 + '1'
        @user.password_confirmation = 'a' * 129 + '1'
        @user.valid?
        expect(@user.errors.full_messages).to include("パスワードは128文字以内で入力してください")
      end
    end

  end
end
