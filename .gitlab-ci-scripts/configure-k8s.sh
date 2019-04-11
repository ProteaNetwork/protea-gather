kubectl config set-cluster $CLUSTER --server="$KUBE_URL" --certificate-authority="$KUBE_CA_PEM_FILE" && \
kubectl config set-credentials admin --token="$KUBE_TOKEN" && \
kubectl config set-context default --cluster="$CLUSTER" --user=admin --namespace="$NAMESPACE" && \
kubectl config use-context default && \
kubectl config get-contexts