# == Schema Information
#
# Table name: element_klasses
#
#  id                  :integer          not null, primary key
#  name                :string
#  label               :string
#  desc                :string
#  icon_name           :string
#  is_active           :boolean          default(TRUE), not null
#  klass_prefix        :string           default("E"), not null
#  is_generic          :boolean          default(TRUE), not null
#  place               :integer          default(100), not null
#  properties_template :jsonb
#  created_by          :integer
#  created_at          :datetime
#  updated_at          :datetime
#  deleted_at          :datetime
#

class ElementKlass < ActiveRecord::Base
  acts_as_paranoid
  has_many :elements, dependent: :destroy
  has_many :segment_klasses

  def self.gen_klasses_json
    klasses = where(is_active: true, is_generic: true).order('place')&.pluck(:name) || []
  rescue ActiveRecord::StatementInvalid, PG::ConnectionBad, PG::UndefinedTable
    klasses = []
  ensure
    File.write(
      Rails.root.join('config', 'klasses.json'),
      klasses&.to_json || []
    )
  end

end
