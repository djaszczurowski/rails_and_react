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
  render: function() {
    return (
      <div className="commentForm">
        CommentForm content
      </div>
    )
  }
});

var CommentBox = React.createClass({
  _fetchComments: function() {
    var that = this;

    $.ajax(
      {
        url: this.props.url,
        dataType: 'json',
        success: function(data) {
          that.setState({data: data});
        },
        error: function() {
          console.log("error")
        }
      }
    )
  },
  getInitialState: function() {
    return { data: [] }
  },
  componentDidMount: function() {
    this._fetchComments();
    setInterval(this._fetchComments, this.props.interval || 100)
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
React.render(<CommentBox url="api/comments" />, document.getElementById("content"))