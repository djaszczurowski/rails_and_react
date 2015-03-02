class Api::CommentsController < ApiController
  def index
    render json: Comment.all
  end

  def create
    Comment.create(create_params)
  end

  private

  def create_params
    params.require(:comment).permit(:author, :content, :markdown)
  end
end