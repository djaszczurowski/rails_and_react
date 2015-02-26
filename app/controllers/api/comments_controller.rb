class Api::CommentsController < ApiController
  def index
    render json: Comment.all
  end
end