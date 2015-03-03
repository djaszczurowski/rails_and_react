class Api::LiveClientsController < Api::LiveController

  def client_connected
    puts "client connected"
  end

  def client_disconnected
    puts "client disconnected"
  end
end