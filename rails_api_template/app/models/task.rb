class Task < ApplicationRecord
  validates :title, presence: true

  validates :status,
            inclusion: {
              in: %w[pending in_progress completed]
            }

  validates :priority,
            inclusion: {
              in: %w[low medium high]
            }

  before_validation :set_defaults, on: :create

  private

  def set_defaults
    self.status ||= "pending"
    self.priority ||= "medium"
    self.completed = false if completed.nil?
  end
end
