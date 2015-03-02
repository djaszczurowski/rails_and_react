class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.string :author, null: false, default: ""
      t.string :content, null: false, default: ""
      t.string :markdown
    end
  end
end
