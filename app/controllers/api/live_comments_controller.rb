class Api::LiveCommentsController < Api::LiveController

  def create
    comment = Comment.new(comment_param)

    if comment.valid? && comment.save
      WebsocketRails[:comments].trigger(:created, comment)
      trigger_success(comment)
    else
      trigger_failure(comment)
    end
  end

  private

  def comment_param
    message.fetch(:comment)
  end

end