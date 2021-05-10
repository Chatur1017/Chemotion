# == Schema Information
#
# Table name: research_plans
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  created_by :integer          not null
#  deleted_at :datetime
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  body       :jsonb
#  screen_id  :bigint
#
# Indexes
#
#  index_research_plans_on_screen_id  (screen_id)
#
# Foreign Keys
#
#  fk_rails_...  (screen_id => screens.id)
#

class ResearchPlan < ApplicationRecord
  acts_as_paranoid
  include ElementUIStateScopes
  include Collectable
  include Taggable
  include Segmentable

  belongs_to :creator, foreign_key: :created_by, class_name: 'User'
  validates :creator, :name, presence: true

  scope :by_name, ->(query) { where('name ILIKE ?', "%#{sanitize_sql_like(query)}%") }

  after_create :create_root_container

  has_one :container, as: :containable
  has_one :research_plan_metadata, dependent: :destroy, foreign_key: :research_plan_id
  has_many :collections_research_plans, inverse_of: :research_plan, dependent: :destroy
  has_many :collections, through: :collections_research_plans
  has_many :attachments, as: :attachable

  has_many :research_plans_wellplates, dependent: :destroy
  has_many :wellplates, through: :research_plans_wellplates

  has_many :research_plans_screens, dependent: :destroy
  has_many :screens, through: :research_plans_screens

  before_destroy :delete_attachment
  accepts_nested_attributes_for :collections_research_plans


  unless Dir.exists?(path = Rails.root.to_s + '/public/images/research_plans')
    Dir.mkdir path
  end

  def attachments
    Attachment.where(attachable_id: self.id, attachable_type: 'ResearchPlan')
  end

  def thumb_svg
    image_atts = attachments.select { |a_img|
      a_img&.content_type&.match(Regexp.union(%w[jpg jpeg png tiff tif]))
    }

    attachment = image_atts[0] || attachments[0]
    preview = attachment.read_thumbnail if attachment
    preview && Base64.encode64(preview) || 'not available'
  end

  def create_root_container
    if self.container == nil
      self.container = Container.create_root_container
    end
  end

  def analyses
    self.container ? self.container.analyses : Container.none
  end

  def svg_files
    fields = body.select { |field| field['type'] == 'ketcher' }
    svg_files = []
    fields.each do |field|
      svg_files << field['value']['svg_file']
    end

    svg_files
  end

  private
  def delete_attachment
    if Rails.env.production?
      attachments.each { |attachment|
        attachment.delay(run_at: 96.hours.from_now, queue: 'attachment_deletion').destroy!
      }
    else
      attachments.each(&:destroy!)
    end
  end

end
