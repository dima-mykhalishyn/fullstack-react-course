function localtunnel {
  lt -s asd890as0dima0adblsdopq --port 5000
}
until localtunnel; do
echo "localtunnel server crashed"
sleep 2
done
