(function() {
  /** @jsx React.DOM */
  var markdownConverter = new Showdown.converter();

  var Comment = React.createClass({
    render: function() {
      var contentMarkdown = markdownConverter.makeHtml((this.props.children || '').toString())

      return (
        <div className="comment">
          <span>
            <b>{this.props.author}: </b>
          </span>

          <span>
            <em>{this.props.content}</em>
          </span>

          <span dangerouslySetInnerHTML={{__html: contentMarkdown}} />
        </div>
      );
    }
  });

  var CommentList = React.createClass({
    render: function() {
      var commentNodes = this.props.data.map(function(dataItem) {
        return (
          <Comment author={dataItem.author} content={dataItem.content}>
            {dataItem.markdown || ''}
          </Comment>
        )
      });

      return (
        <div className="commentList">
          {commentNodes}
        </div>
      );
    }
  });

  var CommentForm = React.createClass({
    _handleSubmitForm: function(event) {
      event.preventDefault();

      var comment = {
        author: this.refs.author.getDOMNode().value.trim(),
        content: this.refs.content.getDOMNode().value.trim(),
        markdown: this.refs.markdown.getDOMNode().value.trim(),
      }

      var onSuccess = function(comment) {};
      var onFailure = function(comment) { console.log("comment creations failure"); };

      this._owner.state.dispatcher.trigger("create_comment", {comment: comment}, onSuccess, onFailure);
    },
    render: function() {
      return (
        <form className="commentForm" onSubmit={this._handleSubmitForm}>
          <input type="text" placeholder="Your name" ref="author"/>
          <input type="text" placeholder="Content of your comment" ref="content" />
          <input type="text" placeholder="markdown (optional)" ref="markdown"/>
          <input type="submit" value="Post" />
        </form>
      )
    }
  });

  var CommentBox = React.createClass({
    _fetchInitComments: function() {
      var that = this;

      $.ajax(
        {
          url: this.props.url,
          dataType: 'json',
          success: function(comments) {
            that.setState({data: comments});
          },
          error: function() { console.log("error") }
        }
      )
    },
    _bindDispather: function() {
      var commentsChannel = this.state.dispatcher.subscribe("comments");
      var that = this;

      commentsChannel.bind("created", function(comment) {
        var newState = that.state.data;
        newState.push(comment);

        that.setState(newState);
      });
    },
    getInitialState: function() {
      return {
        data: [],
        dispatcher: this.props.dispatcher
      }
    },
    componentDidMount: function() {
      this._fetchInitComments();
      this._bindDispather();
    },
    render: function() {
      return (
        <div className="commentBox">
          <CommentList data={this.state.data}/>
          Enter new comment:
          <CommentForm />
        </div>
      );
    }
  });

  var dispatcher = new WebSocketRails("localhost:3000/websocket");

  React.render(
    <CommentBox dispatcher={dispatcher} url="api/comments" />,
    document.getElementById("content")
  )
}());
