class Api::LiveCommentsController < Api::LiveController

  def create
    model = Comment.new(create_params)

    model.save ?
      trigger_success(model) :
      trigger_failure(model)
  end

  private

  def create_params
    params.require(:comment).permit(:author, :content, :markdown)
  end

end